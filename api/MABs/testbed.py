
import numpy as np

class TestBed():
    def __init__(self, mus=[], sigmas=[], bounded=None):
        '''
        Parameters for our test bed:
        mus = Real underlying mean rewards for each arm.
        sigmas = Real underlying standard deviation for each arm.
        bounded = either None or a two element array [low, high], specifies bound of sampling for binary reward 
        '''
        self.mus = mus
        self.sigmas = sigmas
        self.bounds = bounded
    
    def pull(self, arm):
        '''
        arm = index of arm to be pulled
        '''
        mu = self.mus[arm]
        sigma = self.sigmas[arm]

        if self.bounds:
            # Reward is binary, provided with respect to the maximum value in the bound
            reward = np.random.uniform(self.bounds[0], self.bounds[1]) < mu
        else:
            # Reward is continuous, provided with respect to the arm's real mu and sigmas
            # from the normal distribution.
            reward = np.random.normal(mu, sigma)
        
        return reward