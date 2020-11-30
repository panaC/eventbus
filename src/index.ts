import {
  ContainerWithImmerAndGlobAccessAndDispatch,
  TContainer,
  TContainerWithStore,
} from './Container';
import {
  eventEmitter,
  IEventEmitter,
  TContainerWithEventEmitter,
} from './decorator/eventEmitter';
import {IPipe, pipe, TContainerWithPipe} from './decorator/pipe';
import {ISaga, saga} from './decorator/saga';

export interface Mediator<U extends TContainer<V>, V extends string>
  extends ContainerWithImmerAndGlobAccessAndDispatch<U, TMediator<U, V>, V>,
    IEventEmitter<U, V>,
    IPipe<U, V>,
    ISaga {}

type TMediator<
  U extends TContainer<V>,
  V extends string
> = TContainerWithEventEmitter<V> &
  TContainerWithPipe<V> &
  TContainerWithStore<U, V>;

@saga
@pipe
@eventEmitter
export class Mediator<
  U extends TContainer<V>,
  V extends string = ''
> extends ContainerWithImmerAndGlobAccessAndDispatch<U, TMediator<U, V>, V> {}
