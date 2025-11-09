import { create } from 'zustand';
import { Vector3 } from 'three';
import { PROMPT_CATEGORIES, PROMPT_OPTIONS, generateRandomOrder, scoreSubmission } from '../systems/OrderSystem';
import { clampToBounds, createAABB } from '../hooks/useCollision';
import type { PlayerControls } from '../hooks/usePlayerControls';
import type {
  PromptComponentCategory,
  PromptOrder,
  PromptScoreGrade,
  PromptSelection,
} from '../types';

type NPCState = {
  id: string;
  position: [number, number, number];
  targetIndex: number;
  mood: 'waiting' | 'served' | 'leaving';
  order: PromptOrder;
};

type InteractionZone = {
  id: 'prompt-bar' | 'serving-pad';
  bounds: ReturnType<typeof createAABB>;
};

type GameState = {
  score: number;
  servings: number;
  currentOrder: PromptOrder;
  playerHasPrompt: boolean;
  activePromptComponents: string[];
  queue: PromptOrder[];
  npcs: NPCState[];
  playerPosition: [number, number, number];
  playerFacing: PlayerControls['facing'];
  interactionZones: InteractionZone[];
  queuePath: [number, number, number][];
  barStations: [number, number, number][];
  servingPad: [number, number, number];
  bounds: ReturnType<typeof createAABB>;
  promptOptions: typeof PROMPT_OPTIONS;
  selectedPrompt: PromptSelection;
  statusMessage: string;
  setCurrentOrder: (order: PromptOrder) => void;
  setPlayerHasPrompt: (value: boolean) => void;
  incrementScore: (amount: number) => void;
  incrementServings: () => void;
  enqueueOrder: (order: PromptOrder) => void;
  dequeueOrder: () => PromptOrder | undefined;
  randomizeNextOrder: () => void;
  setActivePromptComponents: (components: string[]) => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerFacing: (facing: PlayerControls['facing']) => void;
  registerInteraction: (zoneId: InteractionZone['id']) => void;
  updateNPCMovement: (delta: number) => void;
  setPromptSelection: (category: PromptComponentCategory, value: string) => void;
  resetPromptSelections: () => void;
  setStatusMessage: (message: string) => void;
};

const PLAYER_SPEED = 3.2;

const INITIAL_QUEUE_PATH: [number, number, number][] = [
  [5, 0, 5],
  [3, 0, 3],
  [1, 0, 1],
  [-1, 0, 0],
];

const INITIAL_BAR_STATIONS: [number, number, number][] = [
  [-2, 0, -2],
  [0, 0, -2],
  [2, 0, -2],
];

const SERVING_PAD_POSITION: [number, number, number] = [3, 0, -3];

const WORLD_BOUNDS = createAABB([0, 0, 0], [7, 0, 7]);

const GRADE_MESSAGES: Record<PromptScoreGrade, (score: number) => string> = {
  perfect: (score) => `Perfect prompt served! +${score} pts`,
  great: (score) => `Great delivery. +${score} pts`,
  ok: (score) => `Served with room to iterate. +${score} pts`,
  miss: (_score) => 'Prompt missed the mark. Recalibrate at the bar.',
};

const createNPC = (order: PromptOrder, index: number): NPCState => ({
  id: order.id,
  position: [...INITIAL_QUEUE_PATH[Math.min(index, INITIAL_QUEUE_PATH.length - 1)]] as [number, number, number],
  targetIndex: Math.min(index, INITIAL_QUEUE_PATH.length - 1),
  mood: 'waiting',
  order,
});

const generateOrder = (): PromptOrder => ({
  id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  ...generateRandomOrder(),
});

export const useGameStore = create<GameState>((set, get) => {
  const initialOrder = generateOrder();
  const secondaryOrder = generateOrder();
  const queueSeed = [initialOrder, secondaryOrder];

  return {
    score: 0,
    servings: 0,
    currentOrder: initialOrder,
    playerHasPrompt: false,
    activePromptComponents: [],
    queue: queueSeed,
    npcs: queueSeed.map((order, index) => createNPC(order, index)),
    playerPosition: [-2, 0, -3],
    playerFacing: 'idle-down-right',
    interactionZones: [
      { id: 'prompt-bar', bounds: createAABB([-2, 0, -2.2], [1.6, 1, 1]) },
      { id: 'serving-pad', bounds: createAABB(SERVING_PAD_POSITION, [1.2, 1, 1]) },
    ],
    queuePath: INITIAL_QUEUE_PATH,
    barStations: INITIAL_BAR_STATIONS,
    servingPad: SERVING_PAD_POSITION,
    bounds: WORLD_BOUNDS,
    promptOptions: PROMPT_OPTIONS,
    selectedPrompt: {},
    statusMessage: 'Welcome to Prompt Cafe. Choose components, then assemble at the bar.',
    setCurrentOrder: (order) => set({ currentOrder: order }),
    setPlayerHasPrompt: (value) => set({ playerHasPrompt: value }),
    incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
    incrementServings: () => set((state) => ({ servings: state.servings + 1 })),
    enqueueOrder: (order) =>
      set((state) => ({
        queue: [...state.queue, order],
        npcs: [...state.npcs, createNPC(order, state.npcs.length)],
      })),
    dequeueOrder: () => {
      const state = get();
      if (state.queue.length === 0) return undefined;
      const [first, ...rest] = state.queue;
      set({ queue: rest });
      return first;
    },
    randomizeNextOrder: () => {
      const order = generateOrder();
      set((state) => ({
        currentOrder: order,
        queue: [...state.queue, order],
        statusMessage: 'New prompt request added to the queue.',
      }));
    },
    setActivePromptComponents: (components) => set({ activePromptComponents: components }),
    setPlayerPosition: (position) => set({ playerPosition: clampToBounds(position, WORLD_BOUNDS) }),
    setPlayerFacing: (facing) => set({ playerFacing: facing }),
    setPromptSelection: (category, value) =>
      set((state) => {
        if (state.playerHasPrompt) {
          return {};
        }
        return {
          selectedPrompt: { ...state.selectedPrompt, [category]: value },
          statusMessage: `Selected ${value} ${category}.`,
        };
      }),
    resetPromptSelections: () =>
      set((state) => {
        if (state.playerHasPrompt) {
          return {};
        }
        return {
          selectedPrompt: {},
          statusMessage: 'Cleared prompt selection.',
        };
      }),
    setStatusMessage: (message) => set({ statusMessage: message }),
    registerInteraction: (zoneId) => {
      const state = get();
      if (zoneId === 'prompt-bar') {
        if (state.playerHasPrompt) {
          set({ statusMessage: 'You are already holding a prompt. Serve it at the pad.' });
          return;
        }

        const ready = PROMPT_CATEGORIES.every((category) => Boolean(state.selectedPrompt[category]));
        if (!ready) {
          set({ statusMessage: 'Select tone, format, audience, and constraint before assembling.' });
          return;
        }

        const components = PROMPT_CATEGORIES.map((category) => state.selectedPrompt[category] as string);
        set({
          playerHasPrompt: true,
          activePromptComponents: components,
          statusMessage: 'Prompt ready. Deliver it to the serving pad.',
        });
        return;
      }

      if (zoneId === 'serving-pad') {
        if (!state.playerHasPrompt) {
          set({ statusMessage: 'No prompt to serve. Assemble one at the bar.' });
          return;
        }

        const selectionSnapshot: PromptSelection = { ...state.selectedPrompt };
        const result = scoreSubmission(state.currentOrder, selectionSnapshot);
        const [, ...restQueue] = state.queue;
        const replenishedQueue = restQueue.slice();
        while (replenishedQueue.length < 2) {
          replenishedQueue.push(generateOrder());
        }
        const nextOrder = replenishedQueue[0];
        const rebuiltNPCs = replenishedQueue.map((order, index) => createNPC(order, index));
        const messageFactory = GRADE_MESSAGES[result.grade];
        const statusMessage = messageFactory(result.score);

        set({
          playerHasPrompt: false,
          activePromptComponents: [],
          selectedPrompt: {},
          currentOrder: nextOrder,
          queue: replenishedQueue,
          npcs: rebuiltNPCs,
          statusMessage,
        });
        set((prev) => ({
          score: prev.score + result.score,
          servings: prev.servings + 1,
        }));
      }
    },
    updateNPCMovement: (delta) => {
      const state = get();
      const speed = PLAYER_SPEED * 0.6;
      const updated = state.npcs.map((npc) => {
        const target = state.queuePath[npc.targetIndex] ?? state.queuePath[state.queuePath.length - 1];
        const current = new Vector3(...npc.position);
        const goal = new Vector3(...target);
        const direction = goal.clone().sub(current);
        const distance = direction.length();
        if (distance < 0.05) {
          const nextIndex = Math.min(state.queuePath.length - 1, npc.targetIndex + 1);
          if (nextIndex === npc.targetIndex) {
            return npc;
          }
          return {
            ...npc,
            targetIndex: nextIndex,
          };
        }
        direction.normalize();
        const step = Math.min(distance, delta * speed);
        const nextPosition = current.add(direction.multiplyScalar(step));
        return {
          ...npc,
          position: [nextPosition.x, nextPosition.y, nextPosition.z],
        };
      });
      set({ npcs: updated });
    },
  };
});

export type { NPCState };
