import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string; // Tailwind color classes like "bg-blue-500"
}

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix, icon, color }) => {
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1 });
    return controls.stop;
  }, [value]);

  return (
    <Card className={`flex flex-col ${color || ''}`}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          {icon && <div className="text-white">{icon}</div>}
        </div>
        <motion.span className="text-2xl font-bold">
          {count.to((v) => `${v.toFixed(0)}${suffix || ''}`)}
        </motion.span>
        <Badge>{title}</Badge>
      </CardContent>
    </Card>
  );
};

export default StatCard;
