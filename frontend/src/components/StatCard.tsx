import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<Props> = ({ title, value, icon, color }) => {
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1 });
    return controls.stop;
  }, [value]);

  return (
    <div className={`p-4 rounded-lg text-white ${color}`}>
      <div className="flex items-center justify-between">
        {icon}
        <motion.span className="text-2xl font-bold">
          {count.to((v) => v.toFixed(0))}
        </motion.span>
      </div>
      <p className="text-sm mt-2">{title}</p>
    </div>
  );
};

export default StatCard;
