import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardHeader, CardTitle, CardBody } from "@progress/kendo-react-layout";
import { buildApiUrl } from '../config/api';
import { renderMarkdown } from '../utils/markdownRenderer';

export default function ValueProposition() {
    const [industry, setIndustry] = React.useState<string>('');
    const [companySize, setCompanySize] = React.useState<string>('');
    const [dataTypes, setDataTypes] = React.useState<string[]>([]);
    const [useCase, setUseCase] = React.useState<string>('');
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
        
        parts.push("Highlight the benefits of combining AI-powered search with enterprise-grade UI components.");
        
        return parts.join(' ');
    }, [industry, companySize, dataTypes, useCase]);

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

    return (
        <div className="k-overflow-y-auto">
            <section style={{ background: 'linear-gradient(135deg, #2359D4 20%, #832ED2 50%, #23A5D4 85%)' }} className="k-mx-auto k-text-center k-color-white k-py-20 k-px-4">
                <h1 className="k-h1">Value Proposition Generator</h1>
                <p>Configure your requirements and generate a custom value proposition powered by AI.</p>
            </section>
            <section className="k-py-20 k-text-center">
                <h2 className="k-h2">Configure Your Proposition</h2>
                <p>Use the configurator below to create your custom value proposition.</p>
                <div className="k-d-flex k-flex-column k-gap-2 k-my-20 k-bg-surface k-p-6 k-mx-auto" style={{ maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 className="k-h3 k-align-self-start">Industry</h3>
                    <div className="k-d-grid k-grid-cols-4 k-gap-3">
                        <Button togglable selected={industry === 'Finance'} onClick={() => setIndustry('Finance')}>Finance</Button>
                        <Button togglable selected={industry === 'Healthcare'} onClick={() => setIndustry('Healthcare')}>Healthcare</Button>
                        <Button togglable selected={industry === 'Retail'} onClick={() => setIndustry('Retail')}>Retail</Button>
                        <Button togglable selected={industry === 'Technology'} onClick={() => setIndustry('Technology')}>Technology</Button>
                        <Button togglable selected={industry === 'Manufacturing'} onClick={() => setIndustry('Manufacturing')}>Manufacturing</Button>
                        <Button togglable selected={industry === 'Education'} onClick={() => setIndustry('Education')}>Education</Button>
                        <Button togglable selected={industry === 'Energy'} onClick={() => setIndustry('Energy')}>Energy</Button>
                        <Button togglable selected={industry === 'Transportation'} onClick={() => setIndustry('Transportation')}>Transportation</Button>
                    </div>
                </div>
                <div className="k-d-flex k-flex-column k-gap-2 k-my-20 k-bg-surface k-p-6 k-mx-auto" style={{ maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 className="k-h3 k-align-self-start">Company Size</h3>
                    <div className="k-d-grid k-grid-cols-2 k-gap-3">
                        <Button togglable selected={companySize === 'Small (1-100)'} onClick={() => setCompanySize('Small (1-100)')}>Small (1-100)</Button>
                        <Button togglable selected={companySize === 'Medium (101-1000)'} onClick={() => setCompanySize('Medium (101-1000)')}>Medium (101-1000)</Button>
                        <Button togglable selected={companySize === 'Large (1001-5000)'} onClick={() => setCompanySize('Large (1001-5000)')}>Large (1001-5000)</Button>
                        <Button togglable selected={companySize === 'Enterprise (5000+)'} onClick={() => setCompanySize('Enterprise (5000+)')}>Enterprise (5000+)</Button>
                        <Button togglable selected={companySize === 'Startup'} onClick={() => setCompanySize('Startup')}>Startup</Button>
                        <Button togglable selected={companySize === 'Non-Profit'} onClick={() => setCompanySize('Non-Profit')}>Non-Profit</Button>
                    </div>
                </div>
                <div className="k-d-flex k-flex-column k-gap-2 k-my-20 k-bg-surface k-p-6 k-mx-auto" style={{ maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 className="k-h3 k-align-self-start">Data Types</h3>
                    <p className="k-align-self-start">(select all that apply)</p>
                    <div className="k-d-grid k-grid-cols-2 k-gap-3">
                        <Button togglable selected={dataTypes.includes('Text Documents')} onClick={() => toggleDataType('Text Documents')}>Text Documents</Button>
                        <Button togglable selected={dataTypes.includes('Images')} onClick={() => toggleDataType('Images')}>Images</Button>
                        <Button togglable selected={dataTypes.includes('Videos')} onClick={() => toggleDataType('Videos')}>Videos</Button>
                        <Button togglable selected={dataTypes.includes('Audio Files')} onClick={() => toggleDataType('Audio Files')}>Audio Files</Button>
                        <Button togglable selected={dataTypes.includes('Structured Data')} onClick={() => toggleDataType('Structured Data')}>Structured Data</Button>
                        <Button togglable selected={dataTypes.includes('Sensors/IoT Data')} onClick={() => toggleDataType('Sensors/IoT Data')}>Sensors/IoT Data</Button>
                    </div>
                </div>
                <div className="k-d-flex k-flex-column k-gap-2 k-my-20 k-bg-surface k-p-6 k-mx-auto" style={{ maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 className="k-h3 k-align-self-start">Primary Use Case</h3>
                    <div className="k-d-grid k-grid-cols-2 k-gap-3">
                        <Button togglable selected={useCase === 'Customer Support'} onClick={() => setUseCase('Customer Support')}>Customer Support</Button>
                        <Button togglable selected={useCase === 'Sales Enablement'} onClick={() => setUseCase('Sales Enablement')}>Sales Enablement</Button>
                        <Button togglable selected={useCase === 'Market Research'} onClick={() => setUseCase('Market Research')}>Market Research</Button>
                        <Button togglable selected={useCase === 'Product Development'} onClick={() => setUseCase('Product Development')}>Product Development</Button>
                        <Button togglable selected={useCase === 'Internal Knowledge Management'} onClick={() => setUseCase('Internal Knowledge Management')}>Internal Knowledge Management</Button>
                        <Button togglable selected={useCase === 'Compliance & Legal'} onClick={() => setUseCase('Compliance & Legal')}>Compliance & Legal</Button>
                    </div>
                </div>
                <Button 
                    size="large" 
                    themeColor="primary" 
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate Value Proposition'}
                </Button>
            </section>
            {(valueProposition || isLoading) && (
                <section className="k-pb-20 k-px-4">
                    <div style={{maxWidth: '800px'}} className="k-mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {isLoading ? 'Generating Your Value Proposition...' : 'Your Custom Value Proposition'}
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {isLoading && (
                                    <div className="k-d-flex k-justify-content-center k-align-items-center k-py-8">
                                        <span className="k-icon k-i-loading k-icon-64"></span>
                                    </div>
                                )}
                                {!isLoading && valueProposition && (
                                    <div>{renderMarkdown(valueProposition)}</div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </section>
            )}
        </div>
    );
}