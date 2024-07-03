// app/page.tsx
import Timetable from './Timetable';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Royal Guard of Oman Time Tabling</h1>
      <Timetable />
    </div>
  );
}
