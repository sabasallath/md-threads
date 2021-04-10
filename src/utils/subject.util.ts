import { BehaviorSubject, Observable, Subject } from 'rxjs';

export type ISubject<T> = Subject<T> | BehaviorSubject<T>;

export interface SubObs<T> {
  subject: ISubject<T>;
  obs$: Observable<T>;
}

export class SubjectUtil {
  static subjectObs<T>(): SubObs<T> {
    const subject = new Subject<T>();
    const obs$ = subject.asObservable();
    return { subject, obs$ };
  }

  static behaviorSubjectObs<T>(initialValue: T): SubObs<T> {
    const subject = new BehaviorSubject<T>(initialValue);
    const obs$ = subject.asObservable();
    return { subject, obs$ };
  }
}
