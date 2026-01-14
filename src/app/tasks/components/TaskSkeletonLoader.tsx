import { motion } from "framer-motion";

export default function TaskSkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
      className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 mb-4"
    >
      {/* Title */}
      <div className="h-4 w-3/5 bg-gray-200 rounded-md" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded-md" />
        <div className="h-3 w-4/5 bg-gray-200 rounded-md" />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-3 w-24 bg-gray-200 rounded-md" />
        <div className="h-6 w-16 bg-gray-200 rounded-lg" />
      </div>
    </motion.div>
  );
}
