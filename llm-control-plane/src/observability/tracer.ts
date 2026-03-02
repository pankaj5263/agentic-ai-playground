import { AgentRunTrace, AgentIterationTrace } from "./trace.types"

export class AgentTracer {

  private trace: AgentRunTrace

  constructor(sessionId: string) {
    this.trace = {
      sessionId,
      startedAt: Date.now(),
      iterations: []
    }
  }

  addIteration(data: AgentIterationTrace) {
    this.trace.iterations.push(data)
  }

  finish(output: string) {
    this.trace.finalOutput = output
    this.trace.totalDurationMs = Date.now() - this.trace.startedAt
  }

  fail(error: string) {
    this.trace.error = error
    this.trace.totalDurationMs = Date.now() - this.trace.startedAt
  }

  getTrace() {
    return this.trace
  }
}