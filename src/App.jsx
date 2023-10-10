/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import './App.css'

const PointTarget = ReactPoint.PointTarget

class AutoScalingText extends React.Component {
    state = {
        scale: 1
    }

    componentDidUpdate() {
        const { scale } = this.state

        const node = this.node
        const parentNode = node.parentNode

        const availableWidth = parentNode.offsetWidth
        const actualWidth = node.offsetWidth
        const actualScale = availableWidth / actualWidth

        if (scale === actualScale) return

        if (actualScale < 1) {
            this.setState({ scale: actualScale })
        } else if (scale < 1) {
            this.setState({ scale: 1})
        }
    }

    render() {
        const { scale } = this.state

        return (
            <div
            className="auto-scaling-text"
            style={{transform:`scale(${scale}, ${scale})`}}
            ref={node => this.node = node}
            >{this.props.children}</div>
        )
    }
}
class CalculatorDisplay extends React.Component {
    render() {
        const {value, ...props} = this.props;
        
        const language = navigator.language || 'en-US'

        let formattedValue = parseFloat(value).toLocaleString(language, {
            useGrouping: true,
            maximumFractionDigits: 6
        })

        const match = value.match(/\.\d*?(0*)$/)

        if (match) 
            formattedValue += (/[1-9]/).test(match[0]) ? match[1] : match[0]

        return(
            <div {...props} className="calculator-display">
                <AutoScalingText>{formattedValue}</AutoScalingText>
            </div>
        )
    }
}

class CalculatorKey extends React.Component {
    render() {

        const { onPress, className, ...props} = this.props

        return(
            <PointTarget onPoint={onPress}>
                <button className={`calculator-key ${className}`} {...props}/>
            </PointTarget>
        )
    }
}

const CalculatorOperations = {
    '/': (prevValue, nextValue) => prevValue / nextValue,
    '*': (prevValue, nextValue) => prevValue * nextValue,
    '+': (prevValue, nextValue) => prevValue + nextValue,
    '-': (prevValue, nextValue) => prevValue - nextValue,
    '=': (prevValue, nextValue) => nextValue
}

class Calculator extends React.Component {
    state = {
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false
    }
    
    clearAll() {
        this.setState({
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false
        })
    }

    clearDisplay(){
        this.setState({
            displayValue: '0'
        })
    }

    clearLastChar() {
        const {displayValue} = this.state

        this.setState({
            displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
        })
    }
}