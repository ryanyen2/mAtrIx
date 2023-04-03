import React from "react";
import { useState, useEffect } from 'react';
// import * as d3 from "d3";

export default function ParameterSettings(props) {
    const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
    const [parameterHtml, setParameterHtml] = useState(<div><p>default</p></div>);

    useEffect(() => {
        console.log("Current algorithm changed: " + currentAlgorithm);
        
        fetch('/api/updateModelId',{
            'method':'PUT',
            headers : {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(currentAlgorithm)
        })
        .then(response => response.json())
        .catch(error => console.log(error))

        if(currentAlgorithm === 0) {
            console.log("Setting parameters for epsilon greedy");

            setParameterHtml(
                <form onSubmit={handleSubmitModelParameters}>
                    <label htmlFor="epsilon">Epsilon value here:</label>
                    <input type="number" id="epsilon" name="epsilon"
                           min="0.0001" max="1"></input>
                     <button type="submit">Submit</button>
                </form>
            );
        } else if(currentAlgorithm === 1) {
            // UCB
            console.log("Setting parameters for UCB");
            setParameterHtml(
                <div></div>
            )
        } else if(currentAlgorithm === 2) {
            // Beta TS
            console.log("Setting parameters for Beta TS");
            setParameterHtml(
                <div></div>
            )
        } else if(currentAlgorithm === 3) {
            // Gaussian TS
            console.log("Setting parameters for Gaussian TS");
            setParameterHtml(
                <div></div>
            )
        } else {
            console.error("Sorry, no model linked to index " + currentAlgorithm);
        }

      }, [currentAlgorithm]);

    function handleSubmitModelParameters(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
    
        // You can pass formData as a fetch body directly:
        fetch('/api/updateModelParams', { method: 'PUT', body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        // console.log(formData);
        // console.log(formJson);
      }

    return <div style={{color: "black"}}>
            <label htmlFor="algorithms">Choose an algorithm:</label>

            <select name="algorithms" 
                id="algorithms"
                onChange={e => setCurrentAlgorithm(e.target.value)}>
            <option value="0">Epsilon-greedy</option>
            <option value="1">Upper Confidence Bound</option>
            <option value="2">Thompson Sampling</option>
            </select> 

            {parameterHtml}
        </div>;
}