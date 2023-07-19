import create from 'zustand';

interface ConfigurationStore {
  activeProjectId?: string;
  setProjectId: (projectId: string) => void;
}

const useConfigurationStore = create<ConfigurationStore>(set => ({
  activeProjectId: '',
  setProjectId: (activeProjectId: string) => {
    window?.localStorage?.setItem('activeProjectId', activeProjectId);
    return set(state => ({...state, activeProjectId}));
  }
}));

export default useConfigurationStore;
