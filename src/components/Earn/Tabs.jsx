/* eslint-disable react/prop-types */

const Tabs = ({ onClick, tabList, tabActive }) => {
  return (
    <div className="border border-slate-100 z-50 overflow-hidden w-full grid grid-cols-3 mt-1 mb-3 rounded-xl place-content-center place-items-center">
      {tabList.map((tab, index) => (
        <div key={index} onClick={() => onClick(tab)} className={`w-full text-center text-white py-4 ${tabActive === tab && 'bg-zinc-800 text-white'}`}>
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
