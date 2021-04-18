import React, { createContext } from 'react';
import { SubjectUtil, SubObs } from '../../utils/subject.util';
import { EMPTY, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, startWith, windowToggle } from 'rxjs/operators';
import { flatMap } from 'rxjs/internal/operators';
import Constant from '../../config/constant';

export interface ScrollSpyContextType {
  spy: SubObs<string>;
  auditedSpy$: Observable<string>;
  pauseSpy$: Subject<boolean>;
}

export const ScrollSpyContext = createContext<ScrollSpyContextType>({
  spy: SubjectUtil.subjectObs<string>(),
  auditedSpy$: EMPTY,
  pauseSpy$: new Subject<boolean>(),
});

export class NewPageContextFactory {
  static build(): ScrollSpyContextType {
    const spy = SubjectUtil.subjectObs<string>();
    const pauseSpy$ = new Subject<boolean>();
    const pause$ = pauseSpy$.pipe(startWith(false), distinctUntilChanged());
    const ons$ = pause$.pipe(filter((v) => v));
    const offs$ = pause$.pipe(filter((v) => !v));
    const auditedSpy$ = spy.obs$.pipe(auditTime(Constant.SCROLL_SPY_AUDIT_TIME)).pipe(
      windowToggle(offs$, () => ons$),
      flatMap((x) => x)
    );

    return {
      spy,
      auditedSpy$,
      pauseSpy$,
    };
  }
}

export const useScrollSpy = (): ScrollSpyContextType => React.useContext(ScrollSpyContext);
