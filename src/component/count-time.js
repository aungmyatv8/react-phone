import React, { useEffect, useState } from "react";

function App() {
  const [timeLeft, setTimeLeft] = useState(60);
  //   const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    if (timeLeft === 0) clearTimeout(timer);
  });

  return <div>{timeLeft}</div>;
}

export default App;
