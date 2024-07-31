import CountUp from "react-countup";
import "./Balance.css"
import {useData} from "../Context.jsx";

export default function Balance() {
    const {balance, lastBalance} = useData();

    return (
        <div className="flex gap-2 items-center justify-center text-white z-[5]">
            <img className={'w-10'} src={"./coin.png"} alt="coin"/>
            <CountUp duration={0.2} start={lastBalance} className="counter text-white" end={balance}/>
        </div>
    );
}
