import { useEffect, useState } from "react";
import { useData } from "../components/Context";
import { TONConnect } from "../components/Ton/TONConnect";
import AdsModal from "../components/AdsModal";
import { Button } from "@nextui-org/button";

const Stats = () => {
  const { balanceUp, reward, setReward } = useData();
  const [adController, setAdController] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [buttonVisible, setButtonVisible] = useState(false);
  const [rewardDist, setRewardDist] = useState(0);

  useEffect(() => {
    const initAdsgram = async () => {
      const AdController = await window.Adsgram.init({ blockId: "231" });
      setAdController(AdController);
    };
    initAdsgram().then(() => {
      const randomDelay = Math.floor(Math.random() * 5000) + 5000;
      getRandomPosition();
      getRandomRewards();
      setTimeout(() => {
        if (reward <= 20) {
          setButtonVisible(true);
        }
      }, randomDelay);
    });
  }, []);

  function adsDone() {
    balanceUp(rewardDist);
    const randomDelay = Math.floor(Math.random() * 20000) + 10000;
    getRandomPosition();
    setReward((prev) => prev + 1);
    setTimeout(() => {
      setButtonVisible(true);
    }, randomDelay);
  }

  function adsError() {
    getRandomPosition();
    const randomDelay = Math.floor(Math.random() * 50000) + 10000;
    setTimeout(() => {
      if (reward <= 20) {
        setButtonVisible(true);
      }
    }, randomDelay);
  }

  const handleShowAd = async () => {
    if (!adController) return;
    try {
      const result = await adController.show();
      if (result.done) {
        adsDone();
      } else {
        adsError();
      }
    } catch (error) {
      adsError();
    } finally {
      setButtonVisible(false);
    }
  };

  const getRandomPosition = () => {
    const radius = 35;
    let x, y;
    do {
      x = Math.trunc(Math.random() * 70);
      y = Math.trunc(Math.random() * 70);
      var distance = Math.sqrt(x * x + y * y);
    } while (distance < radius);
    const top = `${x}%`;
    const left = `${y}%`;
    setButtonPosition({ top, left });
  };

  function getRandomRewards() {
    const rew = Math.trunc(Math.random() * 3);
    if (rew === 0) {
      setRewardDist(5000);
    } else if (rew === 1) {
      setRewardDist(7000);
    } else {
      setRewardDist(10000);
    }
  }

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const {
    statsTotal,
    statsTouch,
    statsTotalPlayer,
    statsDailyPlayer,
    statsOnline,
    setStatsTotal,
    setStatsTouch,
    setStatsTotalPlayer,
    setStatsDailyPlayer,
    setStatsOnline,
  } = useData();

  const totalPlayers = 445624 + Math.trunc(Date.now() / 1503680);
  const onlinePlayers = randomNumberInRange(66000, 75000);
  const dailyPlayers = Math.trunc(totalPlayers / 6.1414325);

  const totalTouchPlayers = Math.trunc(totalPlayers * 6069.7685945);
  const totalSharePlayers = Math.trunc(
    (totalTouchPlayers * 75896524) / 25987589
  );

  useEffect(() => {
    setStatsTotal(totalSharePlayers);
    setStatsTouch(totalTouchPlayers);
    setStatsTotalPlayer(totalPlayers);
    setStatsDailyPlayer(dailyPlayers);
    setStatsOnline(onlinePlayers);
  }, []);

  // eslint-disable-next-line react/prop-types
  const Item = ({ desc, number, icon }) => {
    return (
      <div
        className={
          "flex flex-col gap-2.5 items-center justify-center w-full p-3"
        }
      >
        <p className={"text-white text-sm text-center"}>{desc}</p>
        <div className={"flex justify-center items-center gap-2"}>
          {icon && <img src={"./coin.png"} alt="coin" className={"h-7 w-7"} />}
          <p className={"text-white text-xl"}>
            {Number(number).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div
      className={
        "flex flex-col gap-2 w-full h-full pt-5 bg-grid-gray-700/[0.1] relative items-center"
      }
    >
      <AdsModal />
      <TONConnect />

      {buttonVisible && (
        <Button
          color="danger"
          onTouchEnd={() => {
            handleShowAd();
          }}
          className={"shake"}
          style={{ zIndex: 100000, position: "absolute", ...buttonPosition }}
        >
          <b>Get {rewardDist} token!!</b>
        </Button>
      )}

      <Item desc={"Total Share Balance"} number={statsTotal} icon={true} />
      <div className={"w-full h-[0.5px] bg-slate-100 mt-1 mb-2"} />
      <Item desc={"Total Touches"} number={statsTouch} />
      <Item desc={"Total Players"} number={statsTotalPlayer} />
      <Item desc={"Daily Players"} number={statsDailyPlayer} />
      <Item desc={"Players Online"} number={statsOnline} />
    </div>
  );
};

export default Stats;
