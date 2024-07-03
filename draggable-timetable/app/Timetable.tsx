"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DragUpdate,
} from "react-beautiful-dnd";
import { useState } from "react";

type ClassItem = {
  id: string;
  name: string;
  color: string;
};

type TeacherItem = {
  id: string;
  teacherName: string;
  color: string;
}

type Schedule = {
  [key: string]: ClassItem | undefined;
};

type Teacher = {
  [key: string]: TeacherItem | undefined;
}

type TimeTableRowsProps = {
  times: string[];
  hoveredTime: string | null;
  hoveredColor: string | null;
  days: string[];
  schedule: Schedule;
  teacher: Teacher;
};

const TimeTableRows: React.FC<TimeTableRowsProps> = ({
  times,
  hoveredTime,
  hoveredColor,
  days,
  schedule,
  teacher
}) => {
  return (
    <>
      {times.map((time) => (
        <tr key={time}>
          <th
            className={`px-4 py-2 ${hoveredTime === time ? hoveredColor : "text"
              }`}
          >
            {time}
          </th>
          {days.map((day) => (
            <Droppable key={day} droppableId={`${day}-${time}`}>
              {(provided) => (
                <td
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border px-4 py-2 list-none"
                >
                  {schedule[`${day}-${time}`] && (
                    <Draggable
                      draggableId={schedule[`${day}-${time}`]?.id!}
                      index={0}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2 mb-2 text ${schedule[`${day}-${time}`]?.color.split(" ")[0]
                            } text-white rounded`}
                        >
                          {schedule[`${day}-${time}`]?.name}
                        </div>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
   
                 {teacher[`${day}-${time}`] && (
                    <Draggable
                      draggableId={teacher[`${day}-${time}`]?.id!}
                      index={0}
                    >
                      
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2 mb-2 text ${schedule[`${day}-${time}`]?.color.split(" ")[0]
                            } text-white rounded`}
                        >
                          {teacher[`${day}-${time}`]?.teacherName}
                        </div>
                      )}
                    </Draggable>
                  )}
                 {provided.placeholder}
                
                </td>
              )}
            </Droppable>
          ))}
        </tr>
      ))}
    </>
  );
};

const initialClasses: ClassItem[] = [
  { id: "1", name: "Math", color: "bg-blue-500 text-blue-500" },
  { id: "2", name: "English", color: "bg-green-500 text-green-500" },
  { id: "3", name: "Science", color: "bg-yellow-500 text-yellow-500" },
  { id: "4", name: "History", color: "bg-red-500 text-red-500" },
  { id: "5", name: "Art", color: "bg-purple-500 text-purple-500" },
  { id: "6", name: "Music", color: "bg-pink-500 text-pink-500" },
  { id: "7", name: "PE", color: "bg-indigo-500 text-indigo-500" },
  { id: "8", name: "Geography", color: "bg-gray-500 text-gray-500" },
];
const initialTeachers: TeacherItem[] = [
  { id: "1", teacherName: "Math Teacher", color: "bg-blue-500 text-blue-500" },
  { id: "1", teacherName: "Science Teacher", color: "bg-green-500 text-green-500" },
  { id: "1", teacherName: "English Teacher", color: "bg-yellow-500 text-yellow-500" },
  { id: "1", teacherName: "Islamic Teacher", color: "bg-red-500 text-yellow-500" },
  { id: "1", teacherName: "Social Teacher", color: "bg-purple-500 text-purple-500" },
  { id: "1", teacherName: "History Teacher", color: "bg-pink-500 text-pink-500" },
  { id: "1", teacherName: "Arabic Teacher", color: "bg-indigo-500 text-indigo-500" },
  { id: "1", teacherName: "Physics Teacher", color: "bg-gray-500 text-gray-500" },
];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timesMorning = ["9AM", "10AM", "11AM"];
const timesAfternoon = ["1PM", "2PM"];

function Timetable() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [teacher, setTeacher] = useState<Teacher>({});
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const generateUniqueId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    if (sourceId === "classes" && destinationId !== "classes") {
      const movedClass = initialClasses[source.index];
      const newClassInstance = { ...movedClass, id: generateUniqueId() };
      setSchedule((prev) => ({
        ...prev,
        [destinationId]: newClassInstance,
      }));
    } else if (sourceId !== "classes" && destinationId === "classes") {
      const movedClass = schedule[sourceId];
      setSchedule((prev) => {
        const updated = { ...prev };
        delete updated[sourceId];
        return updated;
      });
    } else if (sourceId !== "classes" && destinationId !== "classes") {
      const movedClass = schedule[sourceId];
      setSchedule((prev) => {
        const updated = { ...prev };
        delete updated[sourceId];
        return {
          ...updated,
          [destinationId]: movedClass,
        };
      });
    }

    if (sourceId === "teachers" && destinationId !== "teachers") {
      const movedTeacher = initialTeachers[source.index];
      const newTeacherInstance = { ...movedTeacher, id: generateUniqueId() };
      setTeacher((prev) => ({
        ...prev,
        [destinationId]: newTeacherInstance,
      }));
    } else if (sourceId !== "teachers" && destinationId === "teachers") {
      const movedTeacher = teacher[sourceId];
      setTeacher((prev) => {
        const updated = { ...prev };
        delete updated[sourceId];
        return updated;
      });
    } else if (sourceId !== "teachers" && destinationId !== "teachers") {
      const movedTeacher = teacher[sourceId];
      setTeacher((prev) => {
        const updated = { ...prev };
        delete updated[sourceId];
        return {
          ...updated,
          [destinationId]: movedTeacher,
        };
      });
    }












    setHoveredDay(null);
    setHoveredTime(null);
    setHoveredColor(null);
  };

  const onDragUpdate = (update: DragUpdate) => {
    const sourceId = update.source.droppableId;
    const sourceIndex = update.source.index;
    const hoveredClass = initialClasses[sourceIndex];
    setHoveredColor(hoveredClass.color.split(" ")[1]);

    const destinationId = update.destination?.droppableId;
    if (destinationId) {
      const [day, time] = destinationId.split("-");
      setHoveredDay(day);
      setHoveredTime(time);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="h-full bg-gray-100 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 shadow-lg">
          <Droppable droppableId="classes">
            {(props) => (
              <div
                {...props.droppableProps}
                ref={props.innerRef}
                className="col-span-1 bg-white dark:bg-gray-700 shadow-lg p-4 rounded-md"
              >
                <h2 className="text-xl font-bold mb-4 text">
                  Available Classes
                </h2>
                <ul className="non-list">
                  {initialClasses.map((cls, index) => (
                    <Draggable
                      key={cls.id}
                      draggableId={cls.id.toString()}
                      index={index}
                    >
                      {(props) => (
                        <li
                          ref={props.innerRef}
                          {...props.draggableProps}
                          {...props.dragHandleProps}
                          className={`p-2 mb-2 ${cls.color.split(" ")[0]
                            } text-white rounded`}
                        >
                          {cls.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {props.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
          <Droppable droppableId="teachers">
            {(props) => (
              <div
                {...props.droppableProps}
                ref={props.innerRef}
                className="col-span-1 bg-white dark:bg-gray-700 shadow-lg p-4 rounded-md"
              >
                <h2 className="text-xl font-bold mb-4 text">
                  Available Teachers
                </h2>
                <ul className="non-list">
                  {initialTeachers.map((tcr, index) => (
                    <Draggable
                      key={tcr.id}
                      draggableId={tcr.id.toString()}
                      index={index}
                    >
                      {(props) => (
                        <li
                          ref={props.innerRef}
                          {...props.draggableProps}
                          {...props.dragHandleProps}
                          className={`p-2 mb-2 ${tcr.color.split(" ")[0]
                            } text-white rounded`}
                        >
                          {tcr.teacherName}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {props.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
          <div className="md:col-span-4 bg-white dark:bg-gray-700 shadow-lg p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4 text">Curriculum Schedule</h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2"></th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className={`px-4 py-2 ${hoveredDay === day ? hoveredColor : "text"
                        }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TimeTableRows
                  times={timesMorning}
                  hoveredTime={hoveredTime}
                  hoveredColor={hoveredColor}
                  days={days}
                  schedule={schedule}
                  teacher={teacher}                />
                <tr>
                  <td className="px-4 py-2" />
                  <td
                    colSpan={days.length}
                    className="text-center font-bold border border-gray-300 px-4 py-2 text"
                  >
                    Noon Break
                  </td>
                </tr>
                <TimeTableRows
                  times={timesAfternoon}
                  hoveredTime={hoveredTime}
                  hoveredColor={hoveredColor}
                  days={days}
                  schedule={schedule}
                  teacher={teacher}   
                />
                <tr>
                  <td className="px-4 py-2" />
                  <td
                    colSpan={days.length}
                    className="text-center font-bold border border-gray-300 px-4 py-2 text"
                  >
                    Extra Curricular
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Timetable;
