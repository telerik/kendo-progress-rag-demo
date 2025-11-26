import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { TextArea } from "@progress/kendo-react-inputs";
import { buildApiUrl } from '../config/api';
import { renderMarkdown } from '../utils/markdownRenderer';
import { sparklesIcon } from "@progress/kendo-svg-icons";
import { VectorsBackground } from '../components/VectorsBackground';
import { GradientLoader } from '../components/GradientLoader';

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
        <div className="value-proposition-container k-overflow-y-aut k-overflow-x-hidden value-proposition k-pos-relative">
            {!hasResults ? (
            <>
            <VectorsBackground show={true} />
            {/* Hero Section */}
            <div className="k-d-flex k-flex-column k-pos-relative k-p-12 hero">
                <div className="k-d-flex k-flex-column k-w-full k-gap-8">
                    <h1 className="value-proposition-title !k-mb-0 k-h1">
                        Progress Agentic RAG Value
                    </h1>
                    <p className="value-proposition-description !k-mb-0">
                        Generate a customized value proposition showing exactly how Nuclia delivers ROI for your specific industry, company size, and use case.
                    </p>
                </div>
            </div>
            <section className="k-py-16 k-text-center k-mx-auto k-justify-self-center">
                <div className="k-mb-16 k-d-flex k-flex-col k-gap-7 gradient-wrapper k-pos-relative">
                    <h2 className="k-h2 !k-mb-0">Configure Your Scenario</h2>
                    <p className="k-font-size-sm k-line-height-sm !k-mb-0">Tell us about your organization and we'll create a tailored value proposition</p>
                </div>

                <div className="k-gap-8 k-d-flex k-flex-col">
                    <div className="value-proposition-card k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-6 k-mx-auto k-w-full k-box-sizing-border">
                        <h3 className="k-h3 k-align-self-start !k-mb-0">Industry *</h3>
                        <div className="k-d-grid k-grid-cols-md-3 k-gap-3">
                            <Button togglable selected={industry === 'Financial Services'} onClick={() => setIndustry('Financial Services')} className="k-p-6 k-overflow-hidden">Financial Services</Button>
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
                    <div className="value-proposition-card k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto k-w-full k-box-sizing-border">
                        <h3 className="k-h3 k-align-self-start">Company Size *</h3>
                        <div className="k-d-grid k-grid-cols-md-2 k-gap-3">
                            <Button togglable selected={companySize === 'Small Business (1-100 employees)'} onClick={() => setCompanySize('Small Business (1-100 employees)')} className="k-p-6" >Small Business (1-100 employees)</Button>
                            <Button togglable selected={companySize === 'Mid-Market (101-1,000 employees)'} onClick={() => setCompanySize('Mid-Market (101-1,000 employees)')} className="k-p-6" >Mid-Market (101-1,000 employees)</Button>
                            <Button togglable selected={companySize === 'Large Enterprise (1,001-10,000 employees)'} onClick={() => setCompanySize('Large Enterprise (1,001-10,000 employees)')} className="k-p-6" >Large Enterprise (1,001-10,000 employees)</Button>
                            <Button togglable selected={companySize === 'Global Enterprise (10,000+ employees)'} onClick={() => setCompanySize('Global Enterprise (10,000+ employees)')} className="k-p-6" >Global Enterprise (10,000+ employees)</Button>
                        </div>
                    </div>
                    <div className="value-proposition-card k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto k-w-full k-box-sizing-border">
                        <h3 className="k-h3 k-align-self-start">Data Types * (Select all that apply)</h3>
                        <div className="k-d-grid k-grid-cols-md-3 k-gap-3">
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
                    <div className="value-proposition-card k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto k-w-full k-box-sizing-border">
                        <h3 className="k-h3 k-align-self-start">Primary Use Case *</h3>
                        <div className="k-d-grid k-grid-cols-md-2 k-gap-3">
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
                    <div className="value-proposition-card k-d-flex k-flex-column k-gap-5 k-bg-surface k-p-5 k-mx-auto k-w-full k-box-sizing-border">
                        <h3 className="k-h3 k-align-self-start">Additional Details (Optional)</h3>
                        <TextArea 
                            className="value-proposition-textarea k-textarea"
                            placeholder="Provide any additional context about your organization, specific challenges, or requirements that would help create a more targeted value proposition..."
                            rows={4}
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.value || '')}
                        />
                    </div>
                </div>

                <Button 
                    size="large" 
                    themeColor="primary" 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    svgIcon={sparklesIcon}
                    className="k-gap-3 generate-button k-mt-16">
                    Generate Value Proposition
                </Button>
            </section>
            </>
            ) : (
                <div className="value-proposition-results-container k-d-flex k-flex-column k-w-full">
                    {/* Hero section with title and summary */}
                    <section className={`value-proposition-results-hero k-d-flex k-flex-column k-gap-9 k-align-items-center k-py-12 k-px-6 k-gap-8 ${!isLoading ? 'hero' : ''}`}>
                        {isLoading && (
                            <GradientLoader 
                                title="Generating<br />Custom Value Proposition" 
                                subtitle="Analyzing industry requirements..." 
                            />
                        )}
                        
                        {!isLoading && (
                            <h2 className="value-proposition-results-title gradient-heading k-text-center !k-mb-0">
                                Custom Value Proposition
                            </h2>
                        )}
                        
                        <div className={`value-proposition-user-selection k-p-6 k-d-flex k-flex-col k-flex-md-row k-gap-6 k-p-4 k-box-sizing-border k-w-full ${isLoading ? 'user-selection-wrapper-loading' : 'user-selection-wrapper'}`}>
                            <div className="k-d-flex k-flex-column k-gap-6 k-flex-1">
                                <div className="k-d-flex k-flex-column">
                                    <div className="value-proposition-label">Industry & Size:</div>
                                    <div className="value-proposition-value">{industry}</div>
                                    <div className="value-proposition-value">{companySize}</div>
                                </div>
                                <div className="k-d-flex k-flex-column">
                                    <div className="value-proposition-label">Primary Use Case:</div>
                                    <div className="value-proposition-value">{useCase}</div>
                                </div>
                            </div>
                            <div className="k-d-flex k-flex-column k-gap-6 k-flex-1">
                                <div className="k-d-flex k-flex-column">
                                    <div className="value-proposition-label">Data Types:</div>
                                    <div className="value-proposition-value-compact">{dataTypes.join(', ')}</div>
                                </div>
                                {additionalDetails && (
                                    <div className="k-d-flex k-flex-column">
                                        <div className="value-proposition-additional-label">Additional Details:</div>
                                        <div className="value-proposition-value-compact">{additionalDetails}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Results content */}
                    {!isLoading && valueProposition && (
                        <section className="value-proposition-results-section k-d-flex k-flex-column k-gap-8 k-align-items-center k-px-6 k-py-16">
                            <div className="value-proposition-results-content k-w-full">
                                {renderMarkdown(valueProposition)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}