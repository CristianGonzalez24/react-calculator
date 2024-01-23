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

    toggleSign() {
        const { displayValue } = this.state
        const newValue = parseFloat(displayValue) * -1

        this.setState({
            displayValue: String(newValue)
        })
    }

    inputPercent() {
        const { displayValue } = this.state
        const currentValue = parseFloat(displayValue)

        if (currentValue === 0)
            return
        
        const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
        const newValue = parseFloat(displayValue) / 100;

        this.setState({
            displayValue: String(newValue.toFixed(fixedDigits.length + 2))
        })
    }

    inputDot() {
        const { displayValue } = this.state;

        if (!(/\./).test(displayValue)) {
            this.setState({
                displayValue: displayValue + '.',
                waitingForOperand: false
            })
        }
    }

    inputDigit(digit) {
        const { displayValue, waitingForOperand } = this.setState

        if (waitingForOperand) {
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false
            })
        } else {
            this.setState({
                displayValue: displayValue === '0' ? String(digit) : displayValue + digit
            })
        }
    }

    performOperation(nextOperator) {
        const { value, displayValue, operator } = this.state
        const inputValue = parseFloat(displayValue)

        if (value == null) {
            this.setState({
                value: inputValue
            })
        } else if (operator) {
            const currentValue = value || 0
            const newValue = CalculatorOperations[operator](currentValue, inputValue)

            this.setState({
                value: newValue,
                displayValue: String(newValue)
            })
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator
        })
    }

    handleKeyDown = (event) => {
        let { key } = event

        if (key === 'Enter')
            key = '='

        if ((/\d/).test(key)) {
            event.preventDefault()
            this.inputDigit(parseInt(key, 10))
        } else if (key in CalculatorOperations) {
            event.preventDefault()
            this.performOperation(key)
        } else if (key === '.') {
            event.preventDefault()
            this.inputDot()
        } else if(key === '%') {
            event.preventDefault()
            this.inputPercent()
        } else if (key === 'Backspace') {
            event.preventDefault()
            this.clearLastChar()
        } else if (key === 'Clear') {
            event.preventDefault()
            if (this.state.displayValue !== '0') {
                this.clearDisplay()
            } else {
                this.clearAll()
            }
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    render() {
        const { displayValue } = this.state
        const clearDisplay = displayValue !== '0'
        const clearText = clearDisplay ? 'C' : 'AC'

        return(
            <div className='calculator'>
                <CalculatorDisplay value={displayValue}/>
                <div className='calculator-keypad'>
                    <div className='input-keys'>
                        
                    </div>
                </div>
            </div>
        )
    }
}