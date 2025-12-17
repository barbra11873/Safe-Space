import React from 'react'
import './question.css'

const question = ({
    id = "1",
    question = "what is gbv?",
    choices = ["one","two","three","four"],
    selectedAnswer = null,
    onAnswerSelect = () => {}
}) => {
    const handleChoiceClick = (index) => {
        onAnswerSelect(index);
    };

    return (
        <div className='wrapper'>
            <div className="question">
                <span className="number">{id}.</span>
                <p>{question}</p>
            </div>
            <div className="choices">
                <div 
                    className={`choice ${selectedAnswer === 0 ? 'selected' : ''}`}
                    onClick={() => handleChoiceClick(0)}
                >
                    <span className="bullet">a</span>
                    {choices[0]}
                </div>
                <div 
                    className={`choice ${selectedAnswer === 1 ? 'selected' : ''}`}
                    onClick={() => handleChoiceClick(1)}
                >
                    <span className="bullet">b</span>
                    {choices[1]}
                </div>
                <div 
                    className={`choice ${selectedAnswer === 2 ? 'selected' : ''}`}
                    onClick={() => handleChoiceClick(2)}
                >
                    <span className="bullet">c</span>
                    {choices[2]}
                </div>
                <div 
                    className={`choice ${selectedAnswer === 3 ? 'selected' : ''}`}
                    onClick={() => handleChoiceClick(3)}
                >
                    <span className="bullet">d</span>
                    {choices[3]}
                </div>
            </div>
        </div>
    )
}

export default question
