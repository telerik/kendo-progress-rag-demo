import { Button } from '@progress/kendo-react-buttons';
import { sparklesIcon } from '@progress/kendo-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/finance-analysis');
  };

  return (
    <div className="k-h-full" style={{ 
      background: 'linear-gradient(134deg, #2359D4 14.27%, #832ED2 49.62%, #2B39A4 85.65%)'
    }}>
      <div className="k-d-flex k-flex-column k-text-surface k-align-items-center k-gap-8 k-gap-sm-10 k-gap-md-12 k-gap-lg-14 k-px-4 k-px-sm-6 k-px-md-8 k-px-lg-12 k-px-xl-30 k-py-4 k-py-sm-6 k-py-md-8 k-py-lg-12 k-py-xl-30">
        <div className="k-d-flex k-flex-column k-gap-2 k-gap-sm-3 k-gap-md-4 k-text-center">
          <h1 className="k-h1 k-font-weight-bold !k-mb-0">Nuclia + Telerik DevTools</h1>
          <p className="k-font-size-xl !k-mb-0">Supercharging AI-Powered Applications</p>
        </div>
        <div className="k-d-flex k-flex-column k-gap-4 k-gap-sm-5 k-gap-md-6">
          <p className="k-font-size-lg !k-mb-0 k-px-2 k-px-sm-4 k-px-md-0">Create AI-driven applications that are not only visually compelling and easy to use but also grounded in the most precise, reliable data context - delivering value where it matters most.</p>
          <ul className="k-font-size-lg">
            <li>Seamlessly embed AI-powered search and generative answers directly into your applications.</li>
            <li>Enhance user workflows with intuitive UI components paired with context-rich, reliable insights.</li>
            <li>Accelerate development cycles by combining enterprise-grade UI with enterprise-ready AI retrieval.</li>
            <li>Unlock business outcomes by transforming unstructured data into meaningful knowledge, surfaced through beautiful and functional interfaces.</li>
          </ul>
          <Button 
            className="k-text-surface k-align-self-center" 
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
