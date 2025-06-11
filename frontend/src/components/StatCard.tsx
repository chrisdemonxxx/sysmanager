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
