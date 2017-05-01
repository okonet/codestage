import React, { Component } from 'react'
import { TitleBar, Toolbar, ToolbarNav, ToolbarNavItem, Window } from 'react-desktop/macOs'
import './App.css'
import General from './General'
import CodeStyle from './CodeStyle'

const circle = (
  <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
    <circle cx="12.5" cy="12.5" r="12.5" />
  </svg>
)

class App extends Component {
  state = {
    selected: 1
  }

  renderTab = tabIndex => {
    switch (tabIndex) {
      case 1: {
        return <General />
      }
      case 2: {
        return <CodeStyle />
      }
      case 3: {
        return <h1>Third tab</h1>
      }
      default:
        return null
    }
  }

  render() {
    const { selected } = this.state
    return (
      <Window chrome padding="0px">
        <TitleBar>
          <Toolbar>
            <ToolbarNav>
              <ToolbarNavItem
                title="General"
                icon={circle}
                selected={selected === 1}
                onClick={() => this.setState({ selected: 1 })}
              />
              <ToolbarNavItem
                title="Code Style"
                icon={circle}
                selected={selected === 2}
                onClick={() => this.setState({ selected: 2 })}
              />
              <ToolbarNavItem
                title="Advanced"
                icon={circle}
                selected={selected === 3}
                onClick={() => this.setState({ selected: 3 })}
              />
            </ToolbarNav>
          </Toolbar>
        </TitleBar>

        {this.renderTab(selected)}

      </Window>
    )
  }
}

export default App
