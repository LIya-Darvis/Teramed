import './App.css';
import AuthorizationPage from './ui/pages/AuthorizationPage';
import { DataProvider } from './components/DataProvider';
import { GlobalSpace } from './components/GlobalSpace';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <DataProvider>
          <GlobalSpace/>
        </DataProvider>
      </header>
    </div>
  );
}

export default App;


