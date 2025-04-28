import { createContext, useContext, useState, useCallback } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [order, setOrder] = useState({});
  const [roomOrder, setRoomOrder] = useState(null);
  const [performanceOrders, setPerformanceOrders] = useState([]);

  const clearOrders = useCallback(() => {
    setOrder({});
    setRoomOrder(null);
  }, []);

  const addPerformanceOrder = useCallback((newOrder) => {
    setPerformanceOrders(prevOrders => [...prevOrders, newOrder]);
  }, []);

  return (
    <OrderContext.Provider 
      value={{ 
        order, 
        setOrder, 
        roomOrder, 
        setRoomOrder, 
        clearOrders,
        performanceOrders,
        addPerformanceOrder,
        setPerformanceOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}

export default OrderContext;


