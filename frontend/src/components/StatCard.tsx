import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<Props> = ({ title, value, icon, color }) => {
=======
import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
}

export default function StatCard({ title, value, suffix }: StatCardProps) {

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
=======
    <Card className="flex flex-col">
      <CardContent className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <motion.span className="text-2xl font-bold">
          {count.to((v) => `${v.toFixed(0)}${suffix || ''}`)}
        </motion.span>
        <Badge>{title}</Badge>
      </CardContent>
    </Card>
  );
}
