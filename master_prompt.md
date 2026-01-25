### MISSION
[Describe your feature or bug fix here in 1-2 sentences]
Refer to @agents.md for our stack details and follow the @.cursor/rules/00-orchestrator.mdc pipeline.

### PROTOCOL: AGENTIC_PIPELINE_v1
- ACTIVATE: .cursor/rules/00-orchestrator.mdc
- INITIALIZE: Create TASK_STATE.md at project root.
- MODE: Strict OOP (SOLID Principles).
- STYLE: Token-Saving (Partial updates, //...existing code...).

### CONSTRAINTS
1. Agent 1 (Stubber) must define Interfaces/Abstract classes first.
2. Agent 2 (Tester) must write failing tests before any logic is written.
3. Agent 3 (Implementer) must NOT alter the Architect's signatures.
4. Agent 4 (QA) must run the terminal and verify passes.

### NEXT STEP
Orchestrator, please analyze the mission and transition to STUBBING mode.