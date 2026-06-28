export type State = string;
export type InputSymbol = string;

export interface Transition {
  from: State;
  to: State;
  symbol: InputSymbol;
}

export interface Automaton {
  states: State[];
  alphabet: InputSymbol[];
  transitions: Transition[];
  startState: State;
  acceptStates: State[];
  mapping?: Record<string, State[]>; 
}

export interface NodeData {
  label: string;
  isStart: boolean;
  isAccept: boolean;
  isActive: boolean;
}

export interface SimulationStep {
  currentStates: State[];
  remainingInput: string;
  isAccepted: boolean;
}