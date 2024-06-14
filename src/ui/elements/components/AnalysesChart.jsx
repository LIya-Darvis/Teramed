import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { supabase } from '../../../api/supabaseClient';
import ContentLabel from './ContentLabel';

const AnalysisChart = ({ analysTypeId }) => {
    const [data, setData] = useState([]);
    const [analysisType, setAnalysisType] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Получаем данные анализов по id_analys_type
            const { data: analysesData, error: analysesError } = await supabase
                .from('analyses')
                .select('analys_date, value')
                .eq('id_analys_type', analysTypeId)
                .order('analys_date', { ascending: true });

            if (analysesError) {
                console.error('Error fetching analyses:', analysesError.message);
                return;
            }

            // Получаем информацию о типе анализа
            const { data: analysisTypeData, error: analysisTypeError } = await supabase
                .from('analysis_types')
                .select('lower_limit, upper_limit, name, unit')
                .eq('id', analysTypeId)
                .single();

            if (analysisTypeError) {
                console.error('Error fetching analysis type:', analysisTypeError.message);
                return;
            }

            setData(analysesData);
            setAnalysisType(analysisTypeData);
        };

        fetchData();
    }, [analysTypeId]);

    return (
        <div>
            {analysisType && (
                <div>
                    <p>Статистика общего белка</p>
                    <LineChart
                        width={800}
                        height={400}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="analys_date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <ReferenceLine y={analysisType.lower_limit} label="Нижний предел" stroke="red" />
                        <ReferenceLine y={analysisType.upper_limit} label="Верхний предел" stroke="green" />
                    </LineChart>
                </div>


            )}

        </div>
    );
};

export default AnalysisChart;