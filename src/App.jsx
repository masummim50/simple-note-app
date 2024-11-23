import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function formatTimestampToDate(timestamp) {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Extract date components
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // Short month name (e.g., 'Nov')
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2-digit minutes

  // Determine AM/PM
  const period = hours >= 12 ? 'pm' : 'am';
  const hourIn12 = hours % 12 || 12; // Convert 24-hour format to 12-hour format

  // Format the final string
  return `${day} ${month}, ${hourIn12}:${minutes}${period}`;
}

function App() {

  const [lists, setLists] = useState([]);
  const [bubble, setBubble] = useState([]);


  const handleAddList = (e, color, border, index) => {
    const clickedElement = document.getElementById(`id-${index}`);
    const rect = clickedElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // create a new element
    setBubble(prev => [...prev, { color: color, index: index, x: centerX, y: centerY }]);

    // after a time remove this element from ui
    setTimeout(() => {
      setBubble(prev => prev.filter((item, index) => index !== 0));
    }, 800);

    const date = formatTimestampToDate(new Date().getTime());
    setLists(prev => [{ id: uuidv4(), text: ``, date: date, color: color, border: border }, ...prev]);
  }



  const colors = [
    { color: "bg-red-300", border: "border-t-red-700" },
    { color: "bg-purple-300", border: "border-t-purple-700" },
    { color: "bg-lime-300", border: "border-t-lime-700" },
    { color: "bg-amber-300", border: "border-t-amber-700" },
    { color: "bg-teal-300", border: "border-t-teal-700" },
  ]

  const [showMenu, setShowMenu] = useState(false);
  const containerVariants = {
    hidden: { transition: { staggerChildren: 0.2, staggerDirection: -1 } },
    visible: { transition: { staggerChildren: 0.2, staggerDirection: 1 } },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0, top: -50 },
    visible: { scale: 1, opacity: 1, top: 0 },
  };

  return (
    <div>
      <div>Header</div>


      {
        bubble.map((item, index) => {
          return (
            <motion.div key={index} style={{ position: "fixed", zIndex: 10 }} initial={{ top: item.y - 14, left: item.x - 14, scale: 1, }} animate={{ top: 28, left: 103, scale: 0.8 }} transition={{ duration: 0.5 }} exit={{ scale: 0 }} variants={itemVariants} className={`p-4 rounded-full origin-top-left size-4  ${item.color}`}>
            </motion.div>
          )
        })
      }
      <div className="fixed flex flex-col items-center  w-[100px]">
        <button
          className="rounded-full p-3 leading-none flex items-center justify-center  border border-black text-2xl"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </button>
        <motion.div
          initial="hidden"
          animate={showMenu ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="flex flex-col gap-4 mt-4"
        >
          {colors.map((color, index) => (
            <motion.div

              id={`id-${index}`}
              onClick={(e) => handleAddList(e, color.color, color.border, index)}
              key={color.color}
              variants={itemVariants}
              className={`relative p-4 rounded-full origin-top size-7 cursor-pointer ${color.color}`}
            >
            </motion.div>
          ))}
        </motion.div>
      </div>


      <motion.div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 flex-wrap relative left-[100px] overflow-hidden  w-[calc(100%-100px)]">
        <AnimatePresence>

          {
            lists.map((list, index) => {
              return (
                <NoteCard key={list.id} list={list} index={index} setLists={setLists} />
              )
            })
          }

        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default App



const NoteCard = ({ list, index, setLists }) => {
  const handleDelete = (id) => {
    setLists(prev => prev.filter((item) => item.id !== id));
  }

  const [hasContent, setHasContent] = useState(false);
  const note = useRef(null);

  const checkContent = () => {
    const content = note.current.innerText.trim();
    setHasContent(content.length > 0);
  };

  useEffect(() => {
    // Check for content on mount and whenever the content changes
    // note?.current?.focus();
    checkContent();
  }, [note?.current?.innerHTML]);


  return (
    <motion.div initial={{ scale: 0, opacity: 0, borderRadius: "100%" }} animate={{ scale: 1, opacity: 1, borderRadius: "10%" }} transition={{ duration: 0.5, delay: 0.3 }} exit={{ scale: 0, opacity: 0, borderRadius: "10%", transition: { duration: 0.4, delay: 0 } }} layout key={list.id} className={`${list.color} p-4 border-t-[4px] ${list.border} rounded-md origin-top-left h-[150px] flex flex-col justify-between`}>
      <div className='relative custom-scrollbar flex-grow overflow-y-scroll focus::outline-none focus:border-0 focus:ring-0'>
        <div ref={note} style={{ outline: 'none' }} onInput={checkContent} className="text w-full h-full relative z-[10]" autoFocus contentEditable>

        </div>
        {
          !hasContent && <div aria-disabled className='absolute top-0 left-0 w-full h-full flex justify-center items-center z-[9] opacity-30'>Start typing to add note</div>
        }

      </div>
      <div className='flex justify-between'>
        <p className='text-sm'>{list.date}</p>
        <button onClick={() => handleDelete(list.id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
        </button>

      </div>
    </motion.div>
  );
};