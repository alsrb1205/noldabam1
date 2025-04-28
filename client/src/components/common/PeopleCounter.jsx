export default function PeopleCounter({ value, onChange }) {
    const increment = () => onChange(value + 1);
    const decrement = () => {
      if (value > 1) onChange(value - 1);
    };
  
    return (
      <div className="flex items-center border rounded-xl w-[90px] justify-between px-[12px] py-[7px]">
        <button type="button" onClick={decrement} className="text-xl font-bold">–</button>
        <span className="text-[14px]">{value}명</span>
        <button type="button" onClick={increment} className="text-xl font-bold">+</button>
      </div>
    );
  }
  