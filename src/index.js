import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Button extends React.Component {
  render() {
    const sortBy = this.props.isSortByDESC ? 'DESC' : 'ASC';
    return (
      <button onClick={() =>this.props.onClick()}>
        {sortBy}
      </button>
    );
  };
}
function Square(props) {
    return (
      <button className={"square " + props.className} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      let hilights = [null,null,null];
      if(this.props.hilights) {
        hilights = this.props.hilights;
      }
      let style = false;
      if(i === hilights[0] || i === hilights[1] || i === hilights[2]) {
        style = true;
      }
      if(style) {
        return (
          <Square 
            className={"red"}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
        } else {
          return (
            <Square
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
            />
          );
        }
    }

    render() {
      const boards = [];
      for(let i = 0; i < 9; i = i + 3) {
        boards.push([this.renderSquare(i),this.renderSquare(i + 1),this.renderSquare(i + 2)]);
      }

      return (
        <div>
          {boards.map(b => 
            <div className="board-row">
              {b}
            </div>
            )}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            cols: 0,
            rows: 0,
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isSortByDESC: true,
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      let cols = this.state.history.cols;
      let rows = this.state.history.rows;


      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      if(i <= 2) {
        cols = 1;
      } else if(i > 2 && i <=5) {
        cols = 2;
      } else {
        cols = 3;
      }
      
      if(i === 0 || i === 3 || i ===6) {
          rows = 1;
      } else if(i === 1 || i === 4 || i === 7) {
          rows = 2;
      } else {
          rows = 3;
      }
    
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            cols: cols,
            rows: rows,
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
      console.log(this.state.history);
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    handleSort() {
      this.setState({
        isSortByDESC: !this.state.isSortByDESC,
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const isSortByDESC = this.state.isSortByDESC;

      const moves = history.map((step, move) => {
        const asc = move ?
          'Go to move #' + move + '('  + step.cols + ',' + step.rows + ')':
          'Go to game start';
        const desc = move ?
          'Go to move#' + (history.length - move) + '('  + step.cols + ',' + step.rows + ')':
          'Go to game start';
          let style = false;
        const sortBy = isSortByDESC ? desc : asc;
        if(move === this.state.stepNumber) {
            style = true;
        }
        return (
          <li key={move} >
            {style ?
                <button style={{fontWeight: 1000}} onClick={() => this.jumpTo(move)}>{sortBy}</button> :
                <button onClick={() => this.jumpTo(move)}>{sortBy}</button>
            }
          </li>
        );
      });
      
      let status;
      let hilights;
      if (winner) {
        status = "Winner: " + winner[0];
        hilights = winner[1];
      } else {
        if(this.state.stepNumber === 9) {
          status = "drow";
        } else {
          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              hilights={hilights}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <Button
              isSortByDESC={isSortByDESC} 
              onClick={() => this.handleSort()}/>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }
    return null;
  }
  
  