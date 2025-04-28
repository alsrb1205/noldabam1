import React, { useState, useRef, useEffect, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useLocation, useNavigate } from 'react-router-dom';
import { floorsConfig } from '../components/MusicalSeatReservation/config.js';
import { getMaxRowWidth, getTotalContentHeight, getSeatInfo } from '../components/MusicalSeatReservation/utils.js';
import { AllFloorsLayout } from '../components/MusicalSeatReservation/FloorLayout.jsx';
import { LegendArea } from '../components/MusicalSeatReservation/LegendArea.jsx';
import { SelectedSeatsArea } from '../components/MusicalSeatReservation/SelectedSeatsArea.jsx';
import ShowInfoDisplay from '../components/MusicalSeatReservation/ShowInfoDisplay.jsx';
import { toast } from 'react-toastify';
import Calendar from '../components/common/Calendar.jsx';
import { ReservationModal } from '../components/MusicalSeatReservation/ReservationModal.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import axios from 'axios';

export const MusicalSeatReservation = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isPanning, setIsPanning] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const [reservedSeats, setReservedSeats] = useState([]);
    const clickPreventRef = useRef(false);
    const containerRef = useRef(null);
    const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });
    const zoomWrapperRef = useRef(null);
    const { order, setOrder } = useOrder();
    const navigate = useNavigate();
    // 이전 페이지(BookingModal 등)에서 전달된 공연 정보를 useLocation()으로 확인
    const locationState = useLocation().state || {};
    const { period } = locationState;

    // 공연 기간 파싱
    const [startDate, endDate] = period ? period.split(' ~ ').map(date => {
        const [year, month, day] = date.split('.');
        return new Date(year, month - 1, day);
    }) : [new Date(), new Date()];

    // 현재 날짜
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 선택 가능한 최소 날짜 (오늘 또는 공연 시작일 중 더 늦은 날짜)
    const minDate = new Date(Math.max(today.getTime(), startDate.getTime()));
    // 선택 가능한 최대 날짜 (공연 종료일)
    const maxDate = endDate;

    // 컨테이너 크기 업데이트
    useEffect(() => {
        const updateDims = () => {
            if (containerRef.current) {
                setContainerDims({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, []);

    // 최소 스케일: 컨테이너 너비와 높이를 모두 고려하여 계산
    const minScale = 0.4;  // 0.5로 고정하여 더 작게 설정

    // 최대 스케일: 화면 크기에 따라 동적으로 조정
    const getMaxScale = () => {
        if (window.innerWidth >= 1920) return 3.0;
        if (window.innerWidth >= 1440) return 2.5;
        if (window.innerWidth >= 1024) return 2.0;
        if (window.innerWidth >= 768) return 1.8;
        return 1.5;
    };

    // useEffect로 초기 transform 설정
    useEffect(() => {
        if (zoomWrapperRef.current && containerDims.width && containerDims.height) {
            const contentWidth = getMaxRowWidth() * minScale;
            const x = (containerDims.width - contentWidth) / 2;
            const y = 50;  // 상단에 맞추기 위해 y를 0으로 설정
            zoomWrapperRef.current.setTransform(x, y, minScale);
        }
    }, [containerDims, minScale]);

    // 브라우저 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerDims({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
                if (zoomWrapperRef.current) {
                    const contentWidth = getMaxRowWidth() * minScale;
                    const x = (containerRef.current.clientWidth - contentWidth) / 2;
                    zoomWrapperRef.current.setTransform(x, 0, minScale); // x 좌표를 중앙 정렬
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && zoomWrapperRef.current) {
                const contentWidth = getMaxRowWidth() * minScale;
                const x = (containerRef.current.clientWidth - contentWidth) / 2;
                zoomWrapperRef.current.setTransform(x, 0, minScale); // x 좌표를 중앙 정렬
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        handleResize(); // 초기 실행

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [minScale]);

    // 날짜 선택 핸들러
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedSeats([]); // 날짜 변경 시 선택된 좌석 초기화
    };

    // 날짜 선택 시 예매된 좌석 조회
    useEffect(() => {
        const fetchReservedSeats = async () => {
            if (selectedDate && locationState.title) {
                try {
                    const response = await axios.get("http://localhost:9000/order/performance/reserved-seats", {
                        params: {
                            title: locationState.title,
                            date: selectedDate
                        }
                    });
                    console.log(response.data);
                    
                    setReservedSeats(response.data);
                } catch (error) {
                    console.error("예매된 좌석 조회 실패:", error);
                }
            }
        };

        fetchReservedSeats();
    }, [selectedDate, locationState.title]);

    // 좌석 클릭 핸들러 수정
    const handleSeatClick = (seatId) => {
        if (reservedSeats.includes(seatId)) {
            toast.error("이미 예매된 좌석입니다.");
            return;
        }
        if (!selectedDate) {
            toast.error('예매하실 날짜를 먼저 선택해 주세요.');
            return;
        }
        if (clickPreventRef.current) return;
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }
            if (prev.length >= 4) {
                toast.error('1인 최대 4좌석까지 예매 가능합니다.');
                return prev;
            }
            return [...prev, seatId];
        });
    };

    // 총 가격 계산
    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seatId) => {
            const seatInfo = getSeatInfo(seatId);
            return total + (seatInfo ? seatInfo.priceNumber : 0);
        }, 0);
    };

    // 예매하기 버튼 클릭 핸들러
    const handleReservationClick = () => {
        if (!selectedDate) {
            toast.error('예매하실 날짜를 선택해 주세요.');
            return;
        }
        if (selectedSeats.length === 0) {
            toast.error('좌석을 선택해 주세요.');
            return;
        }
        setShowModal(true);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 결제하기 핸들러
    const handlePayment = () => {
        // 예매 정보 폼 데이터 생성
        const reservationData = {
            title: locationState.title || '',
            performanceId: locationState.mt20id || '',
            date: selectedDate,
            seats: selectedSeats.map(seatId => {
                const seatInfo = getSeatInfo(seatId);
                return {
                    id: seatId,
                    grade: seatInfo ? seatInfo.grade : '',
                    price: seatInfo ? seatInfo.price : '',
                    priceNumber: seatInfo ? seatInfo.priceNumber : 0
                };
            }),
            totalPrice: calculateTotalPrice(),
            venue: locationState.fcltynm || '',
            venueAddress: locationState.venueAddress || '',
            image: locationState.image || '',
            genre: locationState.genrenm || '' // 장르 정보 추가
        };

        setOrder(reservationData);
        setShowModal(false);
        setTimeout(() => {
            navigate("/reservation");
        }, 0);
    };


    return (
        <div className='h-full'>
            {/* 상단 공연 정보 출력 영역 - 500px 제한 없음 */}
            {locationState && locationState.title ? (
                <ShowInfoDisplay
                    title={locationState.title}
                    image={locationState.image}
                    fcltynm={locationState.fcltynm}
                    venueAddress={locationState.venueAddress}
                    genrenm={locationState.genrenm}
                    period={locationState.period}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    minDate={locationState.period?.split(" ~ ")[0]}
                    maxDate={locationState.period?.split(" ~ ")[1]}
                    area={locationState.area}
                    guides={locationState.guides}
                />
            ) : (
                <div className="text-2xl text-center md:text-3xl">
                    공연 정보를 가져오는데 실패하였습니다.
                </div>
            )}

            {/* 나머지 컨텐츠 영역 */}
            <div style={{
                width: "100%",

            }}>
                {/* 768px 이상일 때 레이아웃 */}
                {window.innerWidth >= 768 ? (
                    <>
                        <div className="">
                            <Calendar
                                isMusical={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                selectedDate={selectedDate}
                                onDateChange={(date) => {
                                    if (date) {
                                        const formattedDate = date.toLocaleDateString('en-CA');
                                        setSelectedDate(formattedDate);
                                    } else {
                                        setSelectedDate('');
                                    }
                                }}
                                className='w-full p-2 text-[16px] border-b-2 border-b-blue-500'
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            {/* 좌석 배치도와 예매 정보 영역 */}
                            <div className="flex w-full">

                                {/* 좌석 배치도 영역 */}
                                <div className="flex-1 min-w-0" ref={containerRef}>
                                    <div
                                        className="relative h-[597px] overflow-hidden text-white"
                                        style={{ userSelect: "none", cursor: isPanning ? "grabbing" : "default" }}
                                    >
                                        <TransformWrapper
                                            ref={zoomWrapperRef}
                                            initialScale={minScale}
                                            minScale={minScale}
                                            maxScale={getMaxScale()}
                                            limitToBounds={false}
                                            wheel={{ step: 0.001 }}
                                            panning={{ velocity: 0.05 }}
                                            doubleClick={{ disabled: true }}
                                            onPanningStart={() => setIsPanning(true)}
                                            onPanningStop={(state) => {
                                                setIsPanning(false);
                                                const { scale: currentScale } = state;
                                                if (isNaN(currentScale)) return;

                                                const contentWidth = getMaxRowWidth() * currentScale;
                                                const contentHeight = getTotalContentHeight() * currentScale;
                                                const x = (containerDims.width - contentWidth) / 2;
                                                const y = (containerDims.height - contentHeight) / 2;

                                                if (zoomWrapperRef.current && zoomWrapperRef.current.setTransform) {
                                                    zoomWrapperRef.current.setTransform(x, y, currentScale);
                                                }
                                            }}
                                            onZoomStop={(state) => {
                                                const { scale } = state;
                                                if (isNaN(scale)) return;

                                                const contentWidth = getMaxRowWidth() * scale;
                                                const contentHeight = getTotalContentHeight() * scale;
                                                const x = (containerDims.width - contentWidth) / 2;
                                                const y = (containerDims.height - contentHeight) / 2;

                                                if (zoomWrapperRef.current && zoomWrapperRef.current.setTransform) {
                                                    zoomWrapperRef.current.setTransform(x, y, scale);
                                                }
                                            }}
                                        >
                                            <style>
                                                {`
                                                .transform-component-module_wrapper__SPB86 {
                                                    overflow: visible !important;
                                                }
                                            `}
                                            </style>
                                            <TransformComponent>
                                                <AllFloorsLayout
                                                    floors={floorsConfig}
                                                    selectedSeats={selectedSeats}
                                                    onSeatSelect={handleSeatClick}
                                                    clickPreventRef={clickPreventRef}
                                                    isPanning={isPanning}
                                                    reservedSeats={reservedSeats}
                                                    selectedDate={selectedDate}
                                                />
                                            </TransformComponent>
                                        </TransformWrapper>
                                    </div>
                                </div>

                                {/* 예매 정보 영역 */}
                                <div className="flex-shrink-0 w-[360px]">
                                    <div className=" bg-white border-l border-gray-300 h-[597px] relative">

                                        <div className="p-2">
                                            <LegendArea floors={floorsConfig} selectedSeats={selectedSeats} />
                                        </div>
                                        <div className='absolute bottom-0 w-full'>

                                            <div className="px-2 bg-gray-100 border-t-2">
                                                <SelectedSeatsArea
                                                    selectedSeats={selectedSeats}
                                                    floorsConfig={floorsConfig}
                                                    onRemoveSeat={(seat) => setSelectedSeats((prev) => prev.filter((id) => id !== seat))}
                                                />
                                            </div>
                                        <button
                                            onClick={handleReservationClick}
                                            className="w-full p-2 text-base font-bold text-white bg-blue-500 hover:bg-blue-600"
                                        >
                                            예매하기
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* 768px 미만일 때 레이아웃 (토글 패널) */
                    <div className="block w-full">
                        <div className="">
                            <Calendar
                                isMusical={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                selectedDate={selectedDate}
                                onDateChange={(date) => {
                                    if (date) {
                                        const formattedDate = date.toLocaleDateString('en-CA');
                                        setSelectedDate(formattedDate);
                                    } else {
                                        setSelectedDate('');
                                    }
                                }}
                                className='w-full p-2 text-[16px] border- text-black border-[2px] border-b-blue-500 bg-white'
                            />
                        </div>

                        {/* 좌석 배치도 영역 */}
                        <div className="flex flex-col w-full mx-auto" ref={containerRef}>

                            <div
                                className="relative max-h-[476px] overflow-hidden text-white bg-white"
                                style={{ userSelect: "none", cursor: isPanning ? "grabbing" : "default" }}
                            >
                                {/* 토글 패널 */}
                                <div
                                    className={`absolute top-0 left-1/2 -translate-x-1/2 text-black bg-gray-100 transform transition-transform duration-300 ease-in-out z-40  ${isLegendOpen ? 'border border-b-blue-500' : ''
                                        } w-full`}
                                >
                                    {/* 토글 버튼 */}
                                    <button
                                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                                        className={`absolute z-50 flex items-center justify-center w-[75px] h-6 text-[12px] text-white -translate-x-1/2 bg-blue-500 rounded-b-lg -right-[30px] transition-all duration-300 ${isLegendOpen ? 'top-[260px]' : 'top-0'}`}
                                    >
                                        {isLegendOpen ? '좌석정보▲' : '좌석정보▼'}
                                    </button>

                                    <div className={`w-full overflow-hidden transition-all duration-300 ${isLegendOpen ? 'h-[260px]' : 'h-0'}`}>
                                        <div className="h-[260px] p-2 overflow-y-auto scrollbar-hide">
                                            <LegendArea floors={floorsConfig} selectedSeats={selectedSeats} />
                                        </div>
                                    </div>
                                </div>


                                <TransformWrapper
                                    ref={zoomWrapperRef}
                                    initialScale={minScale}
                                    minScale={minScale}
                                    maxScale={getMaxScale()}
                                    limitToBounds={false}
                                    wheel={{ step: 0.001 }}
                                    panning={{ velocity: 0.05 }}
                                    doubleClick={{ disabled: true }}
                                    onPanningStart={() => setIsPanning(true)}
                                    onPanningStop={(state) => {
                                        setIsPanning(false);
                                        const { scale: currentScale } = state;
                                        if (isNaN(currentScale)) return;

                                        const contentWidth = getMaxRowWidth() * currentScale;
                                        const contentHeight = getTotalContentHeight() * currentScale;
                                        const x = (containerDims.width - contentWidth) / 2;
                                        const y = (containerDims.height - contentHeight) / 2;

                                        if (zoomWrapperRef.current && zoomWrapperRef.current.setTransform) {
                                            zoomWrapperRef.current.setTransform(x, y, currentScale);
                                        }
                                    }}
                                    onZoomStop={(state) => {
                                        const { scale } = state;
                                        if (isNaN(scale)) return;

                                        const contentWidth = getMaxRowWidth() * scale;
                                        const contentHeight = getTotalContentHeight() * scale;
                                        const x = (containerDims.width - contentWidth) / 2;
                                        const y = (containerDims.height - contentHeight) / 2;

                                        if (zoomWrapperRef.current && zoomWrapperRef.current.setTransform) {
                                            zoomWrapperRef.current.setTransform(x, y, scale);
                                        }
                                    }}
                                >
                                    <style>
                                        {`
                                            .transform-component-module_wrapper__SPB86 {
                                                overflow: visible !important;
                                            }
                                        `}
                                    </style>
                                    <TransformComponent>
                                        <AllFloorsLayout
                                            floors={floorsConfig}
                                            selectedSeats={selectedSeats}
                                            onSeatSelect={handleSeatClick}
                                            clickPreventRef={clickPreventRef}
                                            isPanning={isPanning}
                                            reservedSeats={reservedSeats}
                                            selectedDate={selectedDate}
                                        />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </div>
                        <div className='w-full'>
                        <div className="h-[120px] border-t-2 overflow-y-auto bg-gray-100">
                            <SelectedSeatsArea
                                selectedSeats={selectedSeats}
                                floorsConfig={floorsConfig}
                                onRemoveSeat={(seat) => setSelectedSeats((prev) => prev.filter((id) => id !== seat))}
                            />
                        </div>
                        <button
                            onClick={handleReservationClick}
                            className="bottom-0 w-full p-2 text-base font-bold text-white bg-blue-500 hover:bg-blue-600"
                        >
                            예매하기
                        </button>

                        </div>
                    </div>
                )}
            </div>

            {/* 예매 확인 모달 */}
            <ReservationModal
                showModal={showModal}
                onClose={handleCloseModal}
                onPayment={handlePayment}
                locationState={locationState}
                selectedDate={selectedDate}
                selectedSeats={selectedSeats}
                floorsConfig={floorsConfig}
                calculateTotalPrice={calculateTotalPrice}
            />
        </div>
    );
};

export default MusicalSeatReservation;