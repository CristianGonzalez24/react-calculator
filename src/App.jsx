import './App.css'

const PointTarget = ReactPoint.PointTarget

class AutoScalingText extends React.Component {
    state = {
        scale: 1
    }
}

componentDidUpdate() {
    const { scale } = this.state

    const node = this.node
    const parentNode = node.parentNode
}