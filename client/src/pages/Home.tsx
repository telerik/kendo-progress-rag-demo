import { Button } from '@progress/kendo-react-buttons';
import { sparklesIcon } from '@progress/kendo-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/chat-demo');
  };

  return (
    <div className="k-min-h-screen" style={{ 
      background: 'linear-gradient(134deg, #2359D4 14.27%, #832ED2 49.62%, #2B39A4 85.65%)'
    }}>
      <div className="k-d-flex k-flex-column k-text-surface k-align-items-center k-gap-14 k-p-30">
        <div className="k-d-flex k-flex-column k-gap-4">
          <h1 className="k-h1 k-font-weight-bold !k-mb-0">Nuclia + Telerik DevTools</h1>
          <p className="k-font-size-xl !k-mb-0">Supercharging AI-Powered Applications</p>
        </div>
        <div className="k-d-flex k-flex-column k-gap-6">
          <p className="k-font-size-lg !k-mb-0">Create AI-driven applications that are not only visually compelling and easy to use but also grounded in the most precise, reliable data context - delivering value where it matters most.</p>
          <ul className="k-font-size-lg">
            <li>Seamlessly embed AI-powered search and generative answers directly into your applications.</li>
            <li>Enhance user workflows with intuitive UI components paired with context-rich, reliable insights.</li>
            <li>Accelerate development cycles by combining enterprise-grade UI with enterprise-ready AI retrieval.</li>
            <li>Unlock business outcomes by transforming unstructured data into meaningful knowledge, surfaced through beautiful and functional interfaces.</li>
          </ul>
          <Button 
            className="k-text-surface k-w-30 k-align-self-center" 
            fillMode="outline" 
            themeColor="primary" 
            svgIcon={sparklesIcon}
            onClick={handleExploreClick}
          >
            Explore Demos
          </Button>
          </div>
      </div>
    </div>
  );
}
