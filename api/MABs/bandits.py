import numpy as np
import math

def random_argmax(value_list):
  '''
  a random tie-breaking argmax for all arm sampling
  '''
  values = np.asarray(value_list)
  return np.argmax(np.random.random(values.shape) * (values==values.max()))

class BetaTS ():
    def __init__(self, narms=1, params={}):
        # Number of arms
        self.narms = narms

        # Number of trials ran
        self.trials = 0

        # Number of samples to average
        self.k = 10

        # Number of times arm i was selected
        self.N = {}

        # Number of successes for arm i
        self.alpha = {}

        # Number of failures for arm i
        self.beta = {}

        for arm in range(self.narms):
            self.N[arm] = 0
            self.alpha[arm] = 1
            self.beta[arm] = 1
    
    def draw_beta(self, alpha, beta):
        return np.random.beta(alpha, beta)

    def get_action(self):
        '''
        Returns the arm index with the best percieved performance
        '''
        mus_hats = []

        # Sample means from all arms. Conjugate Prior is the Beta distribution
        for arm in range(self.narms):
            mu_samples = [self.draw_beta(self.alpha[arm], self.beta[arm]) for i in range(self.k)]
            # print(f"{arm} --> {np.average(mu_samples)}")
            mus_hats.append(np.average(mu_samples))
        
        # Select the arm with the highest expected reward
        return random_argmax(mus_hats)
    
    def record_reward(self, arm, reward):
        '''
        Observe the reward from pulling arm arm, record and update our arm's prior

        reward should only be 0 or 1, ie: arm was interacted with or not!
        '''
        self.N[arm] += 1
        self.alpha[arm] += reward
        self.beta[arm] += 1-reward
        self.trials += 1

    def model_label(self):
        label = f"Thompson Sampling with Beta Priors"
        return label
    
    def label_state_dump(self):
        overview_dict = {}
        for arm in range(self.narms):
            overview_dict[arm] = {
                "N" : self.N[arm],
                "alpha" : self.alpha[arm],
                "beta" : self.beta[arm]
            }
        return overview_dict

    def print_arm_status(self, real_mu, real_sigma):
        for arm in range(self.narms):
            print(f"Arm {arm}: N={str(self.N[arm]).ljust(5)}, (real_mu={real_mu[arm]}, real_sigma2={real_sigma[arm]}), alpha={self.alpha[arm]:.5f}, beta={self.beta[arm]:.5f}")


class GaussianTS ():
    def __init__(self, narms=1, params={}):
        
        # Number of arms
        self.narms = narms

        # ===== Gaussian Hyper Parameters =====

        # Prior Mean -> For Normal Distribution
        # Random Initial Estimate, will adapt over time to real mu
        self.m_a = 0

        # Prior "count" (> 0) -> For Normal Distribution
        # acts as a learning rate parameter
        if "precision" in params:
            assert params["precision"] > 0, "percision needs to be > 0"
            self.v_a = params["precision"]
        else:
            # Default - Auto Testing
            self.v_a = 0.05

        # Prior Shape (> 0) -> For Inverse Gamma Distribution
        # As alpha -> inf, TS will be quicker to do exploitation
        self.alpha_a = 0.05

        # Prior Scale (> 0) -> For Inverse Gamma Distribution
        # As beta -> 0, TS will be quicker to do exploitation
        self.beta_a = 0.05

        # ===== End of Hyper Parameters =====

        # Number of trials ran
        self.trials = 0

        # Number of times arm i was selected
        self.N = {}

        # Current seen mu for each arm i
        self.mu_tilde = {}

        # Estimated mu for each arm i
        self.rho = {}

        # Percieved/Estimated reward variance
        self.ssd = {}

        self.beta_t_a = {}

        self.sigs = {}

        for arm in range(self.narms):
            self.N[arm] = 0
            self.mu_tilde[arm] = 0
            self.rho[arm] = 0
            self.ssd[arm] = 0
            self.beta_t_a[arm] = 1
            self.sigs[arm] = 0
    
    def draw_ig(self, alpha, beta):
        # draw from an inverse gamma with parameters alpha and beta
        try:
            return 1.0 / np.random.default_rng().gamma(alpha, 1.0 / beta)
        except ZeroDivisionError:
            print("Failed for: " + self.model_label())
            raise

    def get_action(self):
        '''
        Returns the arm index with the best percieved performance
        '''
        mus_hats = []

        # Sample means from all arms. Conjugate Prior is the Normal-inverse-gamma distribution
        # (Possible for us to swap these priors out for future development)
        for arm in range(self.narms):
            # Draw with sigma^2 = IG(1/2 * N_t(arm) + alpha_arm , beta_arm) 
            sigma2_a = self.draw_ig(
                0.5 * self.N[arm] + self.alpha_a,                 # alpha (shape)
                self.beta_t_a[arm]                                # beta (scale)
            )
            # Compute Chi for the arm, v_a acts as a learning rate parameter
            chi_a = sigma2_a / (self.N[arm] + self.v_a)

            self.sigs[arm] = chi_a

            # Draw from our Normal Distribution
            mu_hat_a = np.random.normal(
                self.rho[arm],                                    # mu
                math.sqrt(chi_a)                                  # sigma
            )
            mus_hats.append(mu_hat_a)
        
        # Select the arm with the highest expected reward
        return random_argmax(mus_hats)
    
    def record_reward(self, arm, reward):
        '''
        Observe the reward from pulling arm arm, record and update our arm's prior

        reward can be any continuous number in the real number space, model optimizes for maximum reward
        '''
        old_N, old_mean = self.N[arm], self.mu_tilde[arm]

        self.trials += 1

        # Update the number of times arm has been selected
        self.N[arm] += 1

        # Update our expected mean at time step t+1
        self.mu_tilde[arm] += 1 / self.N[arm] * (reward - self.mu_tilde[arm])

        #
        self.rho[arm] = (self.v_a * self.m_a + self.N[arm] * self.mu_tilde[arm]) / (self.v_a + self.N[arm])

        #
        self.ssd[arm] += ( reward ** 2 + old_N * old_mean ** 2 - self.N[arm] * self.mu_tilde[arm] ** 2 )

        # Shift shape of our beta parameter for future IG samples
        self.beta_t_a[arm] = (self.beta_a + 0.5 * self.ssd[arm]
                                + (self.N[arm] * self.v_a * (self.mu_tilde[arm] - self.m_a) ** 2)
                                / (2 * (self.N[arm] + self.v_a)))
    def model_label(self):
        params = f"Initial Mean Estimate m = {self.m_a}, Pseudo Count v = {self.v_a}, IG alpha = {self.alpha_a}, IG beta = {self.beta_a}"
        label = f"Thompson Sampling with Normal-Inverse-Gamma Conjugate Priors \nParameters: {params}"
        return label
    
    def label_state_dump(self):
        overview_dict = {}
        for arm in range(self.narms):
            overview_dict[arm] = {
                "N" : self.N[arm],
                "mu" : self.mu_tilde[arm],
                "est mu" : self.rho[arm],
                "ssd" : self.ssd[arm],
                "beta_t_a" : self.beta_t_a[arm],
                "sigma" : self.sigs[arm]
            }
        return overview_dict

    def print_arm_status(self, real_mu, real_sigma):
        for arm in range(self.narms):
            print(f"Arm {arm}: N={str(self.N[arm]).ljust(5)}, (real_mu={real_mu[arm]}, real_sigma2={real_sigma[arm]}), est_mu={self.rho[arm]:.5f}, precision={self.sigs[arm]:.5f}")