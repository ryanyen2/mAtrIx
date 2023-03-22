from bandits import GaussianTS, BetaTS
from testbed import TestBed
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm, beta
import math
import os
import pickle
import json

MODEL_PATH = 'model/state.pkl'


## ================================ AUTO MODEL TESTING FUNCTIONS ================================

def plot_beta_dist(alphas, betas, title=""):
    # Plot between -10 and 10 with .001 steps.
    x_axis = np.arange(0, 1, 0.01)
    
    for i, (a, b) in enumerate(zip(alphas.values(), betas.values())):     
        plt.plot(x_axis, beta.pdf(x_axis, a, b), label=f"Arm {i}, alpha={a}, beta={b}")
    plt.ylabel("Confidence")
    plt.xlabel("Reward")
    plt.title(title)
    plt.legend()
    plt.show()
    plt.clf()

def plot_dist(mus, sigma2s, scope=20, title="", bounded=[0,1]):
    # Plot between -10 and 10 with .001 steps.
    if bounded:
        x_axis = np.arange(bounded[0], bounded[1], 0.01)
    else:
        x_axis = np.arange(min(mus) - scope, max(mus) + scope, 0.01)
    
    for i, (mu, sig) in enumerate(zip(mus, sigma2s)):     
        plt.plot(x_axis, norm.pdf(x_axis, mu, math.sqrt(sig)), label=f"Arm {i}, mu={mu:.5f}, sig2={sig:.5f}")
    plt.ylabel("Confidence")
    plt.xlabel("Reward")
    plt.title(title)
    plt.legend()
    plt.show()
    plt.clf()

def run_experiment(model, checkpoints, mus, sigmas, bounded, vis=False):
    # ==========> Experimentation Start <==========
    assert len(mus) == len(sigmas), "Number of mus does not equal number of sigmas"

    if model == 0:
        pass
        #impl_model = GaussianTS(narms=len(mus))
    elif model == 1:
        pass
        #impl_model = GaussianTS(narms=len(mus))
    elif model == 2:
        impl_model = BetaTS(narms=len(mus))
    elif model == 3:
        impl_model = GaussianTS(narms=len(mus))
    else:
        raise Exception(f"Sorry, no model linked to index {model}")

    testbed = TestBed(mus=mus, sigmas=sigmas, bounded=bounded)

    idx = 0
    print(impl_model.model_label())
    for i, check in enumerate(checkpoints):
        while(idx < check):
            arm_idx = impl_model.get_action()
            reward = testbed.pull(arm_idx)
            impl_model.record_reward(arm_idx, reward)
            idx += 1
        
        print(f"---> Checkpoint {check}/{max(checkpoints)} <---")
        impl_model.print_arm_status(mus, sigmas)

        ## Custom visualization, different visualizations per model if applicable
        if vis:
            if model == 2:
                state = impl_model.label_state_dump()
                plot_beta_dist(state.alphas, state.betas, title=f"Checkpoint {check}/{max(checkpoints)}")
            if model == 3:
                state = impl_model.label_state_dump()
                mu_lst, sig_lst = [], []
                for arm in range(len(mus)):
                    mu_lst.append(state.rho[arm])
                    sig_lst.append(state.sigs[arm])
                plot_dist(mu_lst, sig_lst, title=f"Checkpoint {check}/{max(checkpoints)}")
    
    # Possibility to do visualizations down here if needed in matplotlib ...

def auto_model_test(vis=False):
    # Set your model:
    # -> 0 = Epsilon Greedy
    # -> 1 = UCB
    # -> 2 = Beta Thompson Sampling
    # -> 3 = Gaussian Thompson Sampling
    model = 2

    # Checkpoints to print model information, last value is the end iteration epoch
    checkpoints = [1, 10, 25, 50]

    # True Reward of arm, estimated by bandit via explore -> exploit
    # mus = [16.00, 15.00, 16.50, 14.00]
    mus = [0.2, 0.1, 0.5, 0.6]

    # Dispersion/Variation of the true reward, higher == more volatility == flatter curve
    # sigmas = [1.0, 1.5, 0.5, 5.0]
    sigmas = [0.001, 0.001, 0.001, 0.001]

    # Set to two element float array [low, high] for binary predictions, None for continuous
    # bounded = None
    bounded = [0, 1]

    if vis: 
        plot_dist(mus, sigmas, title="Canonical Solution", bounded=bounded) 

    run_experiment(model=model, checkpoints=checkpoints, mus=mus, sigmas=sigmas, bounded=bounded)


## ================================ MANUAL MODEL TESTING FUNCTIONS ================================
def get_current_model_state():
    if(os.path.isfile(MODEL_PATH)):
        # Regain our current state
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        
        return model
    else:
        raise Exception(f"Sorry, no model exists within {MODEL_PATH}")

def reward_model(json_in):
    if(json_in["reset"]):
        if os.path.exists(MODEL_PATH):
            os.remove(MODEL_PATH)
    
    if(os.path.isfile(MODEL_PATH)):
        # Regain our current state
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
    else:
        # Start a New State
        if json_in["model_id"] == 0:
            pass
            #model = EpsilonGreedy(narms=json_in["narms"], params=json_in["params"])
        elif json_in["model_id"] == 1:
            pass
            #model = UCB(narms=json_in["narms"], params=json_in["params"])
        elif json_in["model_id"] == 2:
            model = BetaTS(narms=json_in["narms"], params=json_in["params"])
        elif json_in["model_id"] == 3:
            model = GaussianTS(narms=json_in["narms"], params=json_in["params"])
        else:
            raise Exception(f"Sorry, no model linked to index {model}")
    
    reward = json_in["reward"]
    model.record_reward(json_in["arm"], reward)
    arm_idx = model.get_action()

    # Save our current model:
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    json_out = {
        "model" : model.model_label(),
        "model_id" : json_in["model_id"],
        "labels" : model.label_state_dump(),
        "steps" : model.trials,
        "arm" : arm_idx
    }

    return json_out

def manual_model_test():
    # emulation parameters:
    checkpoints = [1, 10, 25, 50]

    # JSON input object we expect to see fed in to our model:
    json_in = {
        "reward" : 0,
        "reset" : True,
        "model_id" : 3,
        "params" : {
            "precision" : 0.05
        },
        "narms" : 4,
        "arm" : 0
    }

    for i, check in enumerate(checkpoints):
        idx = 0
        while(idx < check):
            idx += 1

            # Manual Mode Testing - Emulate User behaviour
            while(True):
                reward = input("Reward: ")
                if reward.isnumeric():
                    json_in["reward"] = int(reward)
                    break
                else:
                    print("Needs to be numeric!")

            json_out = reward_model(json_in)

            json_in["arm"] = json_out["arm"]
            json_in["reset"] = False
            arm = json_out["arm"]
            print(f"Selected arm is {arm}")
        
        print(f"---> Checkpoint {check}/{max(checkpoints)} <---")
        model = get_current_model_state()
        state = model.label_state_dump()
        for arm in range(json_in["narms"]):
            print(f"For arm {arm}: {state[arm]}")

if __name__ == "__main__":
    # Use for auto testing
    auto_model_test(vis=False)

    # Use for manual testing
    # manual_model_test()