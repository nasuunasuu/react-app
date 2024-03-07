import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import { getFirestore, collection, getDocs ,addDoc} from 'firebase/firestore'; 

function CalendarApp() {
    const today = new Date();
    const [events, setEvents] = useState([]);
    const [year, setYear] = useState(today.getFullYear().toString());
    const [month, setMonth] = useState((today.getMonth() + 1).toString());
    const [day, setDay] = useState(today.getDate().toString());
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('12:00');
    const [endTime, setEndTime] = useState('12:00');
    const [color, setColor] = useState('#e6c229');

    // 予定の追加
    const addEvent = async () => {
        const newEvent = { year, month, day, title, startTime, endTime, color };
        setEvents([...events, newEvent]);

        // Firestore にデータを追加
        try {
            const db = getFirestore(); // Firestore データベースを取得
            const eventsCollection = collection(db, 'events'); // 'events' コレクションを参照
            await addDoc(eventsCollection, newEvent); // Firestore に新しいドキュメントを追加
        } catch (error) {
            console.error('Error adding document: ', error);
        }
        // 保存後、フォームをクリア
        clearForm();
    };

    // フォームのクリア
    const clearForm = () => {
        const today = new Date();
        setYear(today.getFullYear().toString());
        setMonth((today.getMonth() + 1).toString());
        setDay(today.getDate().toString());
        setTitle('');
        setStartTime('00:00');
        setEndTime('00:00');
        setColor('#efefef');
    };

    useEffect(() => {
        // Firestore から予定データを取得してセットする
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, 'events'));
                const fetchedEvents = [];
                querySnapshot.forEach(doc => {
                    fetchedEvents.push(doc.data());
                });
                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };

        fetchData(); // コンポーネントがマウントされたときに Firestore からデータを取得する

    }, []);

    return (
        <div>
            <h1>Calendar App</h1>
            <EventForm
                year={year}
                setYear={setYear}
                month={month}
                setMonth={setMonth}
                day={day}
                setDay={setDay}
                title={title}
                setTitle={setTitle}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                color={color}
                setColor={setColor}
                addEvent={addEvent}
            />
            {/* FullCalendarの表示 */}
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                locale={jaLocale}
                events={events}
                eventContent={renderEventContent}
            />
            <EventList events={events} />
        </div>
    );
}

function EventForm({ year, setYear, month, setMonth, day, setDay, title, setTitle, startTime, setStartTime, endTime, setEndTime, color, setColor, addEvent }) {

    const handleSubmit = (e) => {
        e.preventDefault();
        addEvent();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Year, Month, Dayは現在のものを取得し反映している */}
            <label htmlFor="Year">Year</label>
            <input value={year} id="Year" onChange={(e) => setYear(e.target.value)} /><br />

            <label htmlFor="Month">Month</label>
            <input value={month} id="Month" onChange={(e) => setMonth(e.target.value)} /><br />

            <label htmlFor="Day">Day</label>
            <input value={day} id="Day" onChange={(e) => setDay(e.target.value)} /><br />

            <label htmlFor="Title">Title</label>
            <select value={title} id="Title" onChange={(e) => setTitle(e.target.value)}>
                <option value="school">School</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="event">Event</option>
                {/* タイトルのバリエーションを増やしたければここへ */}

            </select><br />
            <label htmlFor="Start Time">Start Time</label>
            <select value={startTime} id="Start Time" onChange={(e) => setStartTime(e.target.value)}>
                {generateTimeOptions()}
            </select><br />
            <label htmlFor="End Time">End Time</label>
            <select value={endTime} id="End Time" onChange={(e) => setEndTime(e.target.value)}>
                {generateTimeOptions()}
            </select><br />

            <label htmlFor="Color">Color</label>
            <select value={color} id="Color" onChange={(e) => setColor(e.target.value)}>
                <option value="#e6c229">Yellow</option>
                <option value="#f17105">Orange</option>
                <option value="#d11149">Red</option>
                <option value="#6610f2">Purple</option>
                <option value="#1a8fe3">Blue</option>
                {/* 色のバリエーションを増やしたければここへ */}
            </select><br />

            <button type="submit">Add Event</button>
        </form>
    );
}

function EventList({ events }) {
    return (
        <div>
            <h2>Saved Events</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index} style={{ backgroundColor: event.color }}>
                        Year: {event.year}, Month: {event.month}, Day: {event.day}, Title: {event.title}, StartTime: {event.startTime}, EndTime: {event.endTime}, Color: {event.color}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// 5分ごとの時間選択のオプションを生成
function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
            const time = `${padZero(hour)}:${padZero(minute)}`;
            options.push(<option key={time} value={time}>{time}</option>);
        }
    }
    return options;
}

// 1桁の数字を0埋めする関数
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// イベントのコンテンツをレンダリング
function renderEventContent(eventInfo) {
    return (
        <>
            <b style={{ color: eventInfo.event.backgroundColor }}>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

export default CalendarApp;
