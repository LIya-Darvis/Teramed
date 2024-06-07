import './App.css';
import AuthorizationPage from './ui/pages/AuthorizationPage';
import { DataProvider } from './dataProviders/DataProvider';
import { GlobalSpace } from './dataProviders/GlobalSpace';

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


