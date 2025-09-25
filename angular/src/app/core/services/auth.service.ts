import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<User>;

    // user: User;

    constructor(private router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUserKiabi")));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * Returns the current user
     */
    // public currentUser(): User {
    //     return getFirebaseBackend().getAuthenticatedUser();
    // }
    public get currentUserValue(){
        return this.currentUserSubject.value;
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param motDePasse password of user
     */
    login(email: string, motDePasse: string) {
        // return getFirebaseBackend().loginUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, motDePasse })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem("currentUserKiabi", JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        // getFirebaseBackend().logout();
        // remove user from local storage to log user out
        localStorage.removeItem("currentUserKiabi");
        this.currentUserSubject.next(null);
    }
}

