import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';

function App() {

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]} // 追加
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale='ja'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek listWeek', // 追加
        }}
        events={[
          {title:'eventを', start: '2024-03-14'},
          {title:'こんな感じで追加できます', start: '2024-03-15', end: '2024-03-17'}
        ]}
      />
    </div>
  );
}

export default App;