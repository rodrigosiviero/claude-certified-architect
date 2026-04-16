import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { CourseProvider } from './context/CourseContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CourseOverview from './pages/CourseOverview';
import Domain1 from './pages/Domain1';
import Domain2 from './pages/Domain2';
import Domain3 from './pages/Domain3';
import Domain4 from './pages/Domain4';
import Domain5 from './pages/Domain5';
import Labs from './pages/Labs';
import ExamScenarioLabs from './pages/ExamScenarioLabs';
import PracticeExam from './pages/PracticeExam';
import ScenarioExam from './pages/ScenarioExam';
import ScenarioExamHub from './pages/ScenarioExamHub';
import Scenarios from './pages/Scenarios';
import Achievements from './pages/Achievements';
import Flashcards from './pages/Flashcards';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CourseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="overview" element={<CourseOverview />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="domain/1" element={<Domain1 />} />
              <Route path="domain/2" element={<Domain2 />} />
              <Route path="domain/3" element={<Domain3 />} />
              <Route path="domain/4" element={<Domain4 />} />
              <Route path="domain/5" element={<Domain5 />} />
              <Route path="labs" element={<Labs />} />
              <Route path="exam-scenarios" element={<ExamScenarioLabs />} />
              <Route path="practice-exam" element={<PracticeExam />} />
              <Route path="scenario-exam" element={<ScenarioExam />} />
              <Route path="scenario-exams" element={<ScenarioExamHub />} />
              <Route path="scenarios" element={<Scenarios />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="flashcards" element={<Flashcards />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </ThemeProvider>
  );
}

export default App;
