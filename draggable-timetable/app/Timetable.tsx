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

type Schedule = {
  [key: string]: ClassItem | undefined;
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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timesMorning = ["9AM", "10AM", "11AM"];
const timesAfternoon = ["1PM", "2PM"];

const Timetable = () => {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [schedule, setSchedule] = useState<Schedule>({});
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
      const movedClass = classes[source.index];
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

    // 拖拽结束时，清空 hovered day, time 和 color
    setHoveredDay(null);
    setHoveredTime(null);
    setHoveredColor(null);
  };

  const onDragUpdate = (update: DragUpdate) => {
    const sourceId = update.source.droppableId;
    if (sourceId === "classes") {
      const sourceIndex = update.source.index;
      const hoveredClass = classes[sourceIndex];
      setHoveredColor(hoveredClass.color.split(" ")[1]);

      const destinationId = update.destination?.droppableId;
      if (destinationId) {
        const [day, time] = destinationId.split("-");
        setHoveredDay(day);
        setHoveredTime(time);
      }
    }
  };

  type TimeTableRowsProps = {
    times: string[];
  };

  const TimeTableRows: React.FC<TimeTableRowsProps> = ({ times }) => {
    return (
      <>
        {times.map((time) => (
          <tr key={time}>
            <th
              className={`px-4 py-2 ${
                hoveredTime === time ? hoveredColor : ""
              }`}
            >
              {time}
            </th>
            {days.map((day) => (
              <Droppable key={day} droppableId={`${day}-${time}`}>
                {(props) => (
                  <td
                    ref={props.innerRef}
                    {...props.droppableProps}
                    className="border px-4 py-2 list-none"
                  >
                    {schedule[`${day}-${time}`] && (
                      <Draggable
                        draggableId={schedule[`${day}-${time}`]?.id!}
                        index={0}
                      >
                        {(props) => (
                          <div
                            ref={props.innerRef}
                            {...props.draggableProps}
                            {...props.dragHandleProps}
                            className={`p-2 mb-2 ${
                              schedule[`${day}-${time}`]?.color.split(" ")[0]
                            } text-white rounded`}
                          >
                            {schedule[`${day}-${time}`]?.name}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {props.placeholder}
                  </td>
                )}
              </Droppable>
            ))}
          </tr>
        ))}
      </>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        <Droppable droppableId="classes">
          {(props) => (
            <div
              className="col-span-1 bg-white shadow-lg p-4 rounded-md"
              {...props.droppableProps}
              ref={props.innerRef}
            >
              <h2 className="text-xl font-bold mb-4">Available Classes</h2>
              <ul className="list-none">
                {classes.map((cls, index) => (
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
                        className={`p-2 mb-2 ${
                          cls.color.split(" ")[0]
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

        <div className="md:col-span-4 bg-white shadow-lg p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Curriculum Schedule</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2"></th>
                {days.map((day) => (
                  <th
                    key={day}
                    className={`px-4 py-2 ${
                      hoveredDay === day ? hoveredColor : ""
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesMorning.map((time) => (
                <tr key={time}>
                  <th
                    className={`px-4 py-2 ${
                      hoveredTime === time ? hoveredColor : ""
                    }`}
                  >
                    {time}
                  </th>
                  {days.map((day) => (
                    <Droppable key={day} droppableId={`${day}-${time}`}>
                      {(props) => (
                        <td
                          ref={props.innerRef}
                          {...props.droppableProps}
                          className="border px-4 py-2 list-none"
                        >
                          {schedule[`${day}-${time}`] && (
                            <Draggable
                              draggableId={schedule[`${day}-${time}`]?.id!}
                              index={0}
                            >
                              {(props) => (
                                <div
                                  ref={props.innerRef}
                                  {...props.draggableProps}
                                  {...props.dragHandleProps}
                                  className={`p-2 mb-2 ${
                                    schedule[`${day}-${time}`]?.color.split(
                                      " "
                                    )[0]
                                  } text-white rounded`}
                                >
                                  {schedule[`${day}-${time}`]?.name}
                                </div>
                              )}
                            </Draggable>
                          )}
                          {props.placeholder}
                        </td>
                      )}
                    </Droppable>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2" />
                <td
                  colSpan={days.length}
                  className="text-center font-bold border px-4 py-2"
                >
                  Noon Break
                </td>
              </tr>
              {timesAfternoon.map((time) => (
                <tr key={time}>
                  <th
                    className={`px-4 py-2 ${
                      hoveredTime === time ? hoveredColor : ""
                    }`}
                  >
                    {time}
                  </th>
                  {days.map((day) => (
                    <Droppable key={day} droppableId={`${day}-${time}`}>
                      {(props) => (
                        <td
                          ref={props.innerRef}
                          {...props.droppableProps}
                          className="border px-4 py-2 list-none"
                        >
                          {schedule[`${day}-${time}`] && (
                            <Draggable
                              draggableId={schedule[`${day}-${time}`]?.id!}
                              index={0}
                            >
                              {(props) => (
                                <div
                                  ref={props.innerRef}
                                  {...props.draggableProps}
                                  {...props.dragHandleProps}
                                  className={`p-2 mb-2 ${
                                    schedule[`${day}-${time}`]?.color.split(
                                      " "
                                    )[0]
                                  } text-white rounded`}
                                >
                                  {schedule[`${day}-${time}`]?.name}
                                </div>
                              )}
                            </Draggable>
                          )}
                          {props.placeholder}
                        </td>
                      )}
                    </Droppable>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2" />
                <td
                  colSpan={days.length}
                  className="text-center font-bold border px-4 py-2"
                >
                  Extra Curricular
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Timetable;
