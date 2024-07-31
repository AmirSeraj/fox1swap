/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { Button } from "../ui/MovingBorders";
import ModalComponent from "../ModalComponent.jsx";
import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../Context.jsx";

function ModalCard({
  isOpen,
  onOpen,
  onClick,
  cardInfo,
  onOpenChange,
  isDisabledCheck,
  isDisabledGo,
  handleGoFunc,
}) {
  return (
    <ModalComponent
      isOpen={isOpen}
      onOpen={onOpen}
      cardInfo={cardInfo}
      onClick={onClick}
      onOpenChange={onOpenChange}
      isDisabledCheck={isDisabledCheck}
      isDisabledGo={isDisabledGo}
      handleClickGo={handleGoFunc}
    />
  );
}

// eslint-disable-next-line react/prop-types
export const Cards = ({ obj_list, callback }) => {
  const [cardInfo, setCardInfo] = useState();
  const navigate = useNavigate();

  const {
    taskClaimed,
    userid,
    setTaskClaimed,
    balanceUp,

    reward,
    setReward,
  } = useData();

  const [adController, setAdController] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [buttonVisible, setButtonVisible] = useState(false);

  /**ads */
  // useEffect(() => {
  //   if (earned !== 0 && !loaded) {
  //     onOpen();
  //   }
  // }, [earned, loaded]);

  useEffect(() => {
    const initAdsgram = async () => {
      const AdController = await window.Adsgram.init({ blockId: "231" });
      setAdController(AdController);
    };
    initAdsgram().then(() => {
      const randomDelay = Math.floor(Math.random() * 5000) + 5000;
      getRandomPosition();
      setRewardDist(5000);
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

  const [rewardDist, setRewardDist] = useState(0);
  /**ads */

  return (
    <div className="w-full flex flex-col gap-1">
      {/* eslint-disable-next-line react/prop-types */}
      <Button
        color="danger"
        onClick={() => {
          handleShowAd();
        }}
        borderRadius="1.75rem"
        duration={8000}
        containerClassName={`w-full rounded-lg bg-gradient-to-r from-green-900 via-green-400 to-transparent ${
          reward > 20 && "hidden"
        }`}
        className={`px-5 py-2 flex flex-1 justify-between items-center bg-transparent`}
        // className={"shake"}
        // style={{
        //   zIndex: 100000,
        //   position: "absolute",
        //   ...buttonPosition,
        // }}
      >
        <b className="text-xl">Get {rewardDist} Tokens daily !!</b>
        <IoIosArrowForward size={22} />
      </Button>
      
      {obj_list.map((task, index) => {
        const { onOpen, isOpen, onOpenChange } = useDisclosure();
        return (
          <>
            <Card
              key={index}
              onClick={
                taskClaimed.indexOf(index) === -1
                  ? () => {
                      onOpen();
                      setCardInfo({ ...task, btn_text: "Check" });
                      callback();
                    }
                  : {}
              }
              icon={task.icon}
              title={task.title}
              reward={task.reward}
              claimed={taskClaimed.indexOf(index) !== -1 ? true : false}
            />
            <ModalCard
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
              handleGoFunc={() => {
                if (task.type === "invite") {
                  navigate("/friends");
                } else {
                  window.open(task.url, "_blank");
                }
              }}
              onClick={
                // todo: http requests to server and validate data
                async () => {
                  let status = false;
                  if (task.typess === "tg") {
                    let ret = task.url.replace("https://t.me/", "@");
                    await fetch(`https://apifox.spxswap.com/${userid}/${ret}`)
                      .then((res) => {
                        return res.json();
                      })
                      .then((resp) => {
                        status = resp.statusof;
                      });
                  } else {
                    status = true;
                  }

                  if (status) {
                    setTaskClaimed([...taskClaimed, task.id]);
                    balanceUp(task.reward);
                  }
                }
              }
              cardInfo={cardInfo}
            />
          </>
        );
      })}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Card = ({ claimed, key, icon, title, reward, onClick, boosterLevel }) => {
  return (
    <Button
      onClick={onClick}
      borderRadius="1.75rem"
      duration={8000}
      key={key}
      containerClassName={`w-full rounded-lg bg-gradient-to-r ${
        claimed
          ? "from-green-900 via-green-400 to-transparent"
          : "from-green-900 via-green-400 to-transparent"
      }`}
      className={`px-5 py-2 flex flex-1 justify-between items-center bg-transparent`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div className="flex flex-col gap-1.5">
          <p className="text-gray-300 text-left">{title}</p>
          <div className="flex gap-2">
            <img className="w-5 h-5" src="./coin.png" alt="coin" />
            <div className="flex justify-center items-center gap-1">
              <span className="text-gray-300">
                {Number(reward).toLocaleString()}
              </span>
              {boosterLevel && (
                <div className="flex justify-center items-center">
                  <span className="text-gray-400 flex items-center mx-2">
                    |
                  </span>
                  <span className="text-gray-200 flex items-center">
                    {boosterLevel}&nbsp;level
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {claimed ? (
        <IoCheckmarkSharp size={22} color="green" />
      ) : (
        <IoIosArrowForward size={22} />
      )}
    </Button>
  );
};

export default Card;
