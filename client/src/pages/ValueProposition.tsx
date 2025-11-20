import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { buildApiUrl } from '../config/api';
import { renderMarkdown } from '../utils/markdownRenderer';
import { sparklesIcon } from "@progress/kendo-svg-icons";
import './Home.css';

export default function ValueProposition() {
    const [industry, setIndustry] = React.useState<string>('');
    const [companySize, setCompanySize] = React.useState<string>('');
    const [dataTypes, setDataTypes] = React.useState<string[]>([]);
    const [useCase, setUseCase] = React.useState<string>('');
    const [additionalDetails, setAdditionalDetails] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [valueProposition, setValueProposition] = React.useState<string>('');

    const toggleDataType = React.useCallback((dataType: string) => {
        setDataTypes(prev => 
            prev.includes(dataType) 
                ? prev.filter(dt => dt !== dataType)
                : [...prev, dataType]
        );
    }, []);

    const generateQuestion = React.useCallback(() => {
        const parts: string[] = [];
        
        parts.push("Generate a compelling value proposition for Progress Agentic RAG and Telerik DevTools");
        
        if (industry) {
            parts.push(`for a company in the ${industry} industry`);
        }
        
        if (companySize) {
            parts.push(`with ${companySize} employees`);
        }
        
        if (dataTypes.length > 0) {
            parts.push(`that works with ${dataTypes.join(', ')}`);
        }
        
        if (useCase) {
            parts.push(`focusing on ${useCase}`);
        }
        
        if (additionalDetails) {
            parts.push(`Additional context: ${additionalDetails}`);
        }
        
        parts.push("Highlight the benefits of combining AI-powered search with enterprise-grade UI components.");
        
        return parts.join(' ');
    }, [industry, companySize, dataTypes, useCase, additionalDetails]);

    const handleGenerate = React.useCallback(async () => {
        const question = generateQuestion();
        
        setIsLoading(true);
        setValueProposition('');

        try {
            const res = await fetch(buildApiUrl('/api/ask-nuclia'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            if (!res.ok || !res.body) {
                throw new Error('Request failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let currentAnswer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || '';
                
                for (const part of parts) {
                    const lines = part.split('\n').filter(Boolean);
                    const dataLine = lines.find(l => l.startsWith('data: '));
                    const isError = lines.some(l => l.startsWith('event: error'));
                    
                    if (isError) {
                        if (dataLine) {
                            try {
                                const payload = JSON.parse(dataLine.replace(/^data: /, ''));
                                throw new Error(payload.error || 'Error');
                            } catch {
                                throw new Error('Error processing request');
                            }
                        } else {
                            throw new Error('Error processing request');
                        }
                    }
                    
                    if (dataLine) {
                        try {
                            const payload = JSON.parse(dataLine.replace(/^data: /, ''));
                            if (payload.answer) {
                                currentAnswer = payload.answer;
                                setValueProposition(currentAnswer);
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE chunk', e, part);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            setValueProposition(`Sorry, I encountered an error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [generateQuestion]);

    const hasResults = (valueProposition || isLoading);

    return (
        <div className="k-overflow-y-auto value-proposition">
            {!hasResults ? (
            <>
            <div
            className="k-pos-absolute"
            style={{
              right: '0',
              top: '0',
              width: '725px',
              height: '569px',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}vectors.svg`}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                objectPosition: 'left top'
              }}
            />
          </div>
            <section className="k-mx-auto k-text-center" style={{ paddingBlock: "128px", paddingLeft: "128px", paddingRight: "512px" }}>
                <div className="k-d-flex k-align-items-center k-justify-content-center">
                    <div className="k-d-flex k-flex-column k-text-center k-flex-1">
                        <h1 className="gradient-heading k-mt-20 k-mb-8" style={{ padding: "10px" }}>
                        Progress Agentic RAG Value
                        </h1>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="k-d-flex k-align-items-center k-justify-content-center">
                    <p className="k-font-size-xl k-text-center k-flex-1 k-mb-0">
                        Generate a customized value proposition showing exactly how Nuclia delivers ROI for your specific industry, company size, and use case.
                    </p>
                </div>
            </section>
            <section className="k-py-20 k-text-center k-mx-auto">
                <div>
                    <h2 className="k-h2">Configure Your Scenario</h2>
                    <p>Tell us about your organization and we'll create a tailored value proposition</p>
                </div>

                <div className="k-gap-8 k-d-flex k-flex-col">
                    <div className="k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto" style={{ maxWidth: '900px', borderRadius: '28px', boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)', backdropFilter: 'blur(2px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid white' }}>
                        <h3 className="k-h3 k-align-self-start">Industry *</h3>
                        <div className="k-d-grid k-grid-cols-3 k-gap-3">
                            <Button togglable selected={industry === 'Financial Services'} onClick={() => setIndustry('Financial Services')} className="k-p-6">Financial Services</Button>
                            <Button togglable selected={industry === 'Healthcare'} onClick={() => setIndustry('Healthcare')} className="k-p-6" >Healthcare</Button>
                            <Button togglable selected={industry === 'Manufacturing'} onClick={() => setIndustry('Manufacturing')} className="k-p-6" >Manufacturing</Button>
                            <Button togglable selected={industry === 'Technology'} onClick={() => setIndustry('Technology')} className="k-p-6" >Technology</Button>
                            <Button togglable selected={industry === 'Retail & E-commerce'} onClick={() => setIndustry('Retail & E-commerce')} className="k-p-6" >Retail & E-commerce</Button>
                            <Button togglable selected={industry === 'Energy & Utilities'} onClick={() => setIndustry('Energy & Utilities')} className="k-p-6" >Energy & Utilities</Button>
                            <Button togglable selected={industry === 'Government'} onClick={() => setIndustry('Government')} className="k-p-6" >Government</Button>
                            <Button togglable selected={industry === 'Education'} onClick={() => setIndustry('Education')} className="k-p-6" >Education</Button>
                            <Button togglable selected={industry === 'Professional Services'} onClick={() => setIndustry('Professional Services')} className="k-p-6" >Professional Services</Button>
                            <Button togglable selected={industry === 'Media & Entertainment'} onClick={() => setIndustry('Media & Entertainment')} className="k-p-6" >Media & Entertainment</Button>
                            <Button togglable selected={industry === 'Transportation & Logistics'} onClick={() => setIndustry('Transportation & Logistics')} className="k-p-6" >Transportation & Logistics</Button>
                            <Button togglable selected={industry === 'Real Estate'} onClick={() => setIndustry('Real Estate')} className="k-p-6" >Real Estate</Button>
                            <Button togglable selected={industry === 'Other'} onClick={() => setIndustry('Other')} className="k-p-6" >Other</Button>
                        </div>
                    </div>
                    <div className="k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto" style={{ maxWidth: '900px', borderRadius: '28px', boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)', backdropFilter: 'blur(2px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid white' }}>
                        <h3 className="k-h3 k-align-self-start">Company Size *</h3>
                        <div className="k-d-grid k-grid-cols-2 k-gap-3">
                            <Button togglable selected={companySize === 'Small Business (1-100 employees)'} onClick={() => setCompanySize('Small Business (1-100 employees)')} className="k-p-6" >Small Business (1-100 employees)</Button>
                            <Button togglable selected={companySize === 'Mid-Market (101-1,000 employees)'} onClick={() => setCompanySize('Mid-Market (101-1,000 employees)')} className="k-p-6" >Mid-Market (101-1,000 employees)</Button>
                            <Button togglable selected={companySize === 'Large Enterprise (1,001-10,000 employees)'} onClick={() => setCompanySize('Large Enterprise (1,001-10,000 employees)')} className="k-p-6" >Large Enterprise (1,001-10,000 employees)</Button>
                            <Button togglable selected={companySize === 'Global Enterprise (10,000+ employees)'} onClick={() => setCompanySize('Global Enterprise (10,000+ employees)')} className="k-p-6" >Global Enterprise (10,000+ employees)</Button>
                        </div>
                    </div>
                    <div className="k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto" style={{ maxWidth: '900px', borderRadius: '28px', boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)', backdropFilter: 'blur(2px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid white' }}>
                        <h3 className="k-h3 k-align-self-start">Data Types * (Select all that apply)</h3>
                        <div className="k-d-grid k-grid-cols-3 k-gap-3">
                            <Button togglable selected={dataTypes.includes('Customer Data')} onClick={() => toggleDataType('Customer Data')} className="k-p-6" >Customer Data</Button>
                            <Button togglable selected={dataTypes.includes('Product Documentation')} onClick={() => toggleDataType('Product Documentation')} className="k-p-6" >Product Documentation</Button>
                            <Button togglable selected={dataTypes.includes('Internal Knowledge Base')} onClick={() => toggleDataType('Internal Knowledge Base')} className="k-p-6" >Internal Knowledge Base</Button>
                            <Button togglable selected={dataTypes.includes('Compliance Documents')} onClick={() => toggleDataType('Compliance Documents')} className="k-p-6" >Compliance Documents</Button>
                            <Button togglable selected={dataTypes.includes('Training Materials')} onClick={() => toggleDataType('Training Materials')} className="k-p-6" >Training Materials</Button>
                            <Button togglable selected={dataTypes.includes('Technical Documentation')} onClick={() => toggleDataType('Technical Documentation')} className="k-p-6" >Technical Documentation</Button>
                            <Button togglable selected={dataTypes.includes('Sales & Marketing Content')} onClick={() => toggleDataType('Sales & Marketing Content')} className="k-p-6" >Sales & Marketing Content</Button>
                            <Button togglable selected={dataTypes.includes('HR Policies & Procedures')} onClick={() => toggleDataType('HR Policies & Procedures')} className="k-p-6" >HR Policies & Procedures</Button>
                            <Button togglable selected={dataTypes.includes('Financial Reports')} onClick={() => toggleDataType('Financial Reports')} className="k-p-6" >Financial Reports</Button>
                            <Button togglable selected={dataTypes.includes('Research & Development')} onClick={() => toggleDataType('Research & Development')} className="k-p-6" >Research & Development</Button>
                            <Button togglable selected={dataTypes.includes('Legal Documents')} onClick={() => toggleDataType('Legal Documents')} className="k-p-6" >Legal Documents</Button>
                            <Button togglable selected={dataTypes.includes('Operational Procedures')} onClick={() => toggleDataType('Operational Procedures')} className="k-p-6" >Operational Procedures</Button>
                        </div>
                    </div>
                    <div className="k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto" style={{ maxWidth: '900px', borderRadius: '28px', boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)', backdropFilter: 'blur(2px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid white' }}>
                        <h3 className="k-h3 k-align-self-start">Primary Use Case *</h3>
                        <div className="k-d-grid k-grid-cols-2 k-gap-3">
                            <Button togglable selected={useCase === 'Customer Support Enhancement'} onClick={() => setUseCase('Customer Support Enhancement')} className="k-p-6" >Customer Support Enhancement</Button>
                            <Button togglable selected={useCase === 'Employee Self-Service'} onClick={() => setUseCase('Employee Self-Service')} className="k-p-6" >Employee Self-Service</Button>
                            <Button togglable selected={useCase === 'Sales Enablement'} onClick={() => setUseCase('Sales Enablement')} className="k-p-6" >Sales Enablement</Button>
                            <Button togglable selected={useCase === 'Compliance & Risk Management'} onClick={() => setUseCase('Compliance & Risk Management')} className="k-p-6" >Compliance & Risk Management</Button>
                            <Button togglable selected={useCase === 'Research & Development'} onClick={() => setUseCase('Research & Development')} className="k-p-6" >Research & Development</Button>
                            <Button togglable selected={useCase === 'Knowledge Management'} onClick={() => setUseCase('Knowledge Management')} className="k-p-6" >Knowledge Management</Button>
                            <Button togglable selected={useCase === 'Process Automation'} onClick={() => setUseCase('Process Automation')} className="k-p-6" >Process Automation</Button>
                            <Button togglable selected={useCase === 'Decision Support'} onClick={() => setUseCase('Decision Support')} className="k-p-6" >Decision Support</Button>
                            <Button togglable selected={useCase === 'Content Management'} onClick={() => setUseCase('Content Management')} className="k-p-6" >Content Management</Button>
                            <Button togglable selected={useCase === 'Other'} onClick={() => setUseCase('Other')} className="k-p-6" >Other</Button>
                        </div>
                    </div>
                    <div className="k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto" style={{ maxWidth: '900px', borderRadius: '28px', boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)', backdropFilter: 'blur(2px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid white' }}>
                        <h3 className="k-h3 k-align-self-start">Additional Details (Optional)</h3>
                        <textarea 
                            className="k-textarea"
                            placeholder="Provide any additional context about your organization, specific challenges, or requirements that would help create a more targeted value proposition..."
                            rows={4}
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            style={{ width: '100%', borderRadius: '12px', border: '2px solid #bacae3', padding: '24px' }}
                        />
                    </div>
                </div>

                <Button 
                    size="large" 
                    themeColor="primary" 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    svgIcon={sparklesIcon}
                    className="k-gap-3 generate-button k-my-16">
                    Generate Value Proposition
                </Button>
            </section>
            </>
            ) : (
                <div className="k-d-flex k-flex-column" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', width: '100%' }}>
                    {/* Hero section with title and summary */}
                    <section className="k-d-flex k-flex-column k-gap-9 k-align-items-center k-px-8 k-py-16" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', background: 'linear-gradient(180deg, rgba(250, 250, 250, 0.80) 85%, rgba(236, 236, 236, 0.80) 100%)'}}>
                        {isLoading && (
                            <div className="k-d-flex k-flex-column k-gap-6 k-align-items-center">
                                <h2 className="gradient-heading k-text-center k-mb-0" style={{ fontSize: '36px', lineHeight: '1', fontWeight: 500, letterSpacing: 'normal' }}>
                                    Generating<br />Custom Value Proposition
                                </h2>
                                <span className="k-icon k-i-loading" style={{ fontSize: '80px', color: '#2359D4' }}></span>
                                <p className="k-mb-0" style={{ fontSize: '16px', lineHeight: '1.5', color: '#323130' }}>
                                    Analyzing industry requirements...
                                </p>
                            </div>
                        )}
                        
                        {!isLoading && (
                            <h2 className="gradient-heading k-text-center k-mb-0" style={{ fontSize: '36px', lineHeight: '1', fontWeight: 500, letterSpacing: 'normal', maxWidth: '800px' }}>
                                Custom Value Proposition
                            </h2>
                        )}
                        
                        <div className="k-p-6 k-d-flex k-gap-6 test" style={{ 
                            maxWidth: '770px', 
                            width: '100%',
                            borderRadius: '20px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                            border: '1px solid white',
                            boxShadow: '0 2px 6px 0 rgba(13, 10, 44, 0.08)',
                            backdropFilter: 'blur(2px)'
                        }}>
                            <div className="k-d-flex k-flex-column k-gap-6 k-flex-1">
                                <div className="k-d-flex k-flex-column">
                                    <div style={{ fontSize: '16px', opacity: 0.5, marginBottom: '4px' }}>Industry & Size:</div>
                                    <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.5' }}>{industry}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.5' }}>{companySize}</div>
                                </div>
                                <div className="k-d-flex k-flex-column">
                                    <div style={{ fontSize: '16px', opacity: 0.5, marginBottom: '4px' }}>Primary Use Case:</div>
                                    <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.5' }}>{useCase}</div>
                                </div>
                            </div>
                            <div className="k-d-flex k-flex-column k-gap-6 k-flex-1">
                                <div className="k-d-flex k-flex-column">
                                    <div style={{ fontSize: '16px', opacity: 0.5, marginBottom: '4px' }}>Data Types:</div>
                                    <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.2' }}>{dataTypes.join(', ')}</div>
                                </div>
                                {additionalDetails && (
                                    <div className="k-d-flex k-flex-column">
                                        <div style={{ fontSize: '16px', opacity: 0.5, marginBottom: '4px' }}>Additional Details:</div>
                                        <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.2' }}>{additionalDetails}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Results content */}
                    {!isLoading && valueProposition && (
                        <section className="k-d-flex k-flex-column k-gap-8 k-align-items-center k-px-6 k-py-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                            <div style={{ maxWidth: '770px', width: '100%', fontSize: '16px', lineHeight: '1.5', color: '#323130' }}>
                                {renderMarkdown(valueProposition)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}