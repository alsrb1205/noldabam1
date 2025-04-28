import React, { useRef, useEffect, useState } from "react";
import "./card.css";

const Card = ({ dataImage, header, onClick }) => {
    const cardRef = useRef(null);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isLeaving, setIsLeaving] = useState(false);
    useEffect(() => {
        const { offsetWidth: width, offsetHeight: height } = cardRef.current;
        setDimensions({ width, height });
    }, []);


    const handleMouseMove = (e) => {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left - dimensions.width / 2;
        const y = e.clientY - top - dimensions.height / 2;
        setMouse({ x, y });
    };

    const handleMouseLeave = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setMouse({ x: 0, y: 0 });
            setIsLeaving(false);
        }, 1000);
    };

    const handleMouseEnter = () => {
        setIsLeaving(false);
    };

    const mousePX = mouse.x / dimensions.width;
    const mousePY = mouse.y / dimensions.height;

    const cardStyle = {
        transform: `rotateY(${mousePX * 30}deg) rotateX(${mousePY * -30}deg)`,
        transition: isLeaving ? "transform 1s ease" : "none",
    };

    const cardBgTransform = {
        transform: `translateX(${mousePX * -40}px) translateY(${mousePY * -40}px)`,
        backgroundImage: `url(${dataImage})`,
    };

    return (
        <div
            className={`card-wrap card-visible`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
            ref={cardRef}
        >
            <div className="card" style={cardStyle}>
                <div className="card-bg" style={cardBgTransform}></div>
                <div className="card-info">
                    <div className="font-bold pb-[10px]">{header}</div>
                </div>
            </div>
        </div>
    );
};

export default Card;
