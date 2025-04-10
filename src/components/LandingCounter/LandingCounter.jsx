import React from "react";
import CountUp from 'react-countup';

export default function LandingCounter({ count }) {
  return (
    <span className="landing-status__count">
      <CountUp 
        end={count} 
        duration={5} 
        separator="," 
      />
    </span>

// const [courseCounter, setCourseCounter] = useState(0);

// useEffect(() => {
//   // زمان مورد نظر برای شمارش (5 ثانیه)
//   const duration = 5000; // 5000ms = 5s

//   // تعداد دفعات به‌روزرسانی
//   const steps = 50; // تعداد دفعات به‌روزرسانی در کل زمان

//   // محاسبه مقدار افزایش در هر مرحله
//   const increment = Math.ceil(count / steps);

//   // محاسبه فاصله زمانی بین هر به‌روزرسانی
//   const interval = duration / steps;

//   let counter = setInterval(() => {
//     setCourseCounter((prevCount) => {
//       const nextCount = prevCount + increment;
//       if (nextCount >= count) {
//         clearInterval(counter);
//         return count;
//       }
//       return nextCount;
//     });
//   }, interval);

//   return () => clearInterval(counter);
// }, [count]);

// return <span className="landing-status__count">{courseCounter}</span>;

  );
}