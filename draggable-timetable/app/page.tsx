// app/page.tsx
import Timetable from './Timetable';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Draggable Timetable</h1>
      <Timetable />
    </div>
  );
}
