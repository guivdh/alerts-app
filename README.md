## Scenario

Howdy fellow developer, we have been tasked by our Product Owner to create a webpage that
exposes the following functionalities:

1. As a user, I can see, create, update or delete an alert for a signal
    * A signal is defined by :
    ```typescript
    export interface Signal {
        signalName: string;
        description?: string;
        component: string;
        system: string;
        subSystem: string;
        element: string;
    }
    ```
    * An alert is defined by :
    ```typescript
    export interface Alert {
        signal: Signal;
        lowerThreshold: number;
        upperThreshold: number;
    }
    ```
* To define an alert, the user has to first choose a signal, then he has to specify a lower and an upper threshold.
* To choose a signal, the user has to select first a component, then a system, then a subSystem and then an element
* 'signalName' is unique and it is linked to a unique component>system>subSystem>element key 
* A user can only update the thresholds of an alert, not its signal

The available signals have been given to us in a JSON file named `signals.json`

## Instructions

- There are very few rules, feel free to use the technologies you fancy (although most of the time, the team chooses to
  use Angular and Typescript);
- No backend application, no data persistence;
- Our Product Owner expressed very basic needs, but would be very happy if some additional features are baked in;
- Tests should be added if necessary;
- We have to demonstrate our application to the Product Owner and explain our implementation choices.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ ng serve
```

## Test

```bash
# unit tests
$ ng test
```

