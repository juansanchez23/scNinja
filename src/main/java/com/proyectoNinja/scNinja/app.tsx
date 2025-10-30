
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Ninja, Mision, Jutsu, NotificationType, Rango, Aldea, Atributo, NinjaBuilderData } from './types';
import { api } from './services/api';
import { AttackIcon, DefenseIcon, ChakraIcon, HealthIcon, MoneyIcon, UserPlusIcon, PlusCircleIcon, CrossIcon } from './components/Icons';

// Helper Components (defined outside the main App to avoid re-creation on re-renders)

const aldeas: Aldea[] = ['Konoha', 'Suna', 'Iwaga', 'Kiriga', 'Kumoga'];
const rangos: Rango[] = ['Genin', 'Chunin', 'Jonin', 'Kage'];
const atributos: Atributo[] = ['ataque', 'defensa', 'chakra', 'salud'];

// #region Components

const Header: React.FC<{ onAddNinja: () => void; onAddMision: () => void; onStartCombat: () => void; combatReady: boolean }> = ({ onAddNinja, onAddMision, onStartCombat, combatReady }) => (
  <header className="bg-card/50 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-border-color shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">Ninja World Manager</h1>
      <div className="flex items-center gap-4">
        {combatReady && (
            <button onClick={onStartCombat} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold transition-colors flex items-center gap-2">
                Start Combat
            </button>
        )}
        <button onClick={onAddNinja} className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors flex items-center gap-2">
          <UserPlusIcon className="w-5 h-5" /> New Ninja
        </button>
        <button onClick={onAddMision} className="px-4 py-2 bg-secondary hover:bg-border-color rounded-md font-semibold transition-colors flex items-center gap-2">
          <PlusCircleIcon className="w-5 h-5" /> New Mission
        </button>
      </div>
    </div>
  </header>
);

const NinjaCard: React.FC<{ ninja: Ninja; onSelect: (id: number) => void; isSelected: boolean; onTrain: (ninja: Ninja) => void; onAcceptMision: (ninja: Ninja) => void }> = ({ ninja, onSelect, isSelected, onTrain, onAcceptMision }) => {
    const rankColor = {
        Genin: 'text-green-400',
        Chunin: 'text-blue-400',
        Jonin: 'text-purple-400',
        Kage: 'text-red-500',
    }[ninja.rango] || 'text-slate-400';

    return (
        <div className={`bg-card rounded-lg shadow-md border ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border-color'} p-4 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-primary/50`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-text-main">{ninja.nombre}</h3>
                    <p className={`font-semibold ${rankColor}`}>{ninja.rango} - {ninja.aldea}</p>
                </div>
                <div className="text-right">
                     <div className="flex items-center gap-1 text-yellow-400">
                        <MoneyIcon className="w-4 h-4" />
                        <span className="font-bold">{ninja.dinero}</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2"><AttackIcon className="w-4 h-4 text-red-400"/> Attack: {ninja.ataque}</div>
                <div className="flex items-center gap-2"><DefenseIcon className="w-4 h-4 text-blue-400"/> Defense: {ninja.defensa}</div>
                <div className="flex items-center gap-2"><ChakraIcon className="w-4 h-4 text-purple-400"/> Chakra: {ninja.chakra}</div>
                <div className="flex items-center gap-2"><HealthIcon className="w-4 h-4 text-green-400"/> Health: {ninja.salud}</div>
            </div>
             <div className="mt-4">
                <h4 className="font-semibold text-text-dim text-sm">Jutsus:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {ninja.jutsus.length > 0 ? ninja.jutsus.map((jutsu, i) => (
                        <span key={i} className="bg-slate-700 text-xs font-medium px-2 py-1 rounded-full">{jutsu.nombre}</span>
                    )) : <span className="text-xs text-text-dim">No jutsus learned.</span>}
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={() => onSelect(ninja.id)} className={`w-full text-sm py-2 rounded-md font-semibold transition-colors ${isSelected ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-500'}`}>
                    {isSelected ? 'Deselect' : 'Select for Combat'}
                </button>
                <button onClick={() => onTrain(ninja)} className="w-full text-sm py-2 rounded-md bg-slate-600 hover:bg-slate-500 font-semibold transition-colors">Train</button>
                <button onClick={() => onAcceptMision(ninja)} className="w-full text-sm py-2 rounded-md bg-slate-600 hover:bg-slate-500 font-semibold transition-colors">Mission</button>
            </div>
        </div>
    );
};

const MisionCard: React.FC<{ mision: Mision }> = ({ mision }) => (
    <div className="bg-card rounded-lg shadow-md border border-border-color p-4">
        <h3 className="text-lg font-bold text-text-main">{mision.descripcion}</h3>
        <div className="flex justify-between items-baseline mt-2 text-sm">
            <p className="text-text-dim">Rank Required: <span className="font-semibold text-cyan-400">{mision.rangoMinimo}</span></p>
            <p className="text-yellow-400 flex items-center gap-1">
                <MoneyIcon className="w-4 h-4" /> 
                <span className="font-bold">{mision.recompensa}</span>
            </p>
        </div>
    </div>
);


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border-color" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-border-color">
                    <h2 className="text-xl font-bold text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-dim hover:text-text-main transition-colors">
                       <CrossIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-dim mb-1">{label}</label>
        <input {...props} className="w-full bg-slate-900 border border-border-color rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"/>
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-text-dim mb-1">{label}</label>
        <select {...props} className="w-full bg-slate-900 border border-border-color rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow">
            {children}
        </select>
    </div>
);


const NinjaForm: React.FC<{ onSubmit: (data: { type: 'factory' | 'builder', payload: any }) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
    const [formType, setFormType] = useState<'factory' | 'builder'>('factory');
    const [factoryData, setFactoryData] = useState({ nombre: '', aldea: aldeas[0] });
    const [builderData, setBuilderData] = useState<NinjaBuilderData>({
        nombre: '', rango: rangos[0], aldea: aldeas[0], ataque: 10, defensa: 10, chakra: 10, salud: 100, dinero: 50, jutsus: []
    });
    const [newJutsu, setNewJutsu] = useState({ nombre: '', poder: 10 });

    const handleJutsuAdd = () => {
        if (newJutsu.nombre.trim()) {
            setBuilderData(prev => ({ ...prev, jutsus: [...prev.jutsus, newJutsu] }));
            setNewJutsu({ nombre: '', poder: 10 });
        }
    };

    const handleJutsuRemove = (index: number) => {
        setBuilderData(prev => ({ ...prev, jutsus: prev.jutsus.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formType === 'factory') {
            onSubmit({ type: 'factory', payload: factoryData });
        } else {
            onSubmit({ type: 'builder', payload: builderData });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-slate-900 rounded-lg p-1">
                <button type="button" onClick={() => setFormType('factory')} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${formType === 'factory' ? 'bg-primary text-white' : 'text-text-dim hover:bg-slate-700'}`}>Factory</button>
                <button type="button" onClick={() => setFormType('builder')} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${formType === 'builder' ? 'bg-primary text-white' : 'text-text-dim hover:bg-slate-700'}`}>Builder</button>
            </div>
            {formType === 'factory' ? (
                <div className="space-y-4">
                    <FormInput label="Name" value={factoryData.nombre} onChange={e => setFactoryData(p => ({...p, nombre: e.target.value}))} required />
                    <FormSelect label="Village" value={factoryData.aldea} onChange={e => setFactoryData(p => ({...p, aldea: e.target.value as Aldea}))}>
                        {aldeas.map(a => <option key={a} value={a}>{a}</option>)}
                    </FormSelect>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    <FormInput label="Name" value={builderData.nombre} onChange={e => setBuilderData(p => ({...p, nombre: e.target.value}))} required />
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect label="Village" value={builderData.aldea} onChange={e => setBuilderData(p => ({...p, aldea: e.target.value as Aldea}))}>
                           {aldeas.map(a => <option key={a} value={a}>{a}</option>)}
                        </FormSelect>
                         <FormSelect label="Rank" value={builderData.rango} onChange={e => setBuilderData(p => ({...p, rango: e.target.value as Rango}))}>
                           {rangos.map(r => <option key={r} value={r}>{r}</option>)}
                        </FormSelect>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Attack" type="number" value={builderData.ataque} onChange={e => setBuilderData(p => ({...p, ataque: +e.target.value}))} />
                        <FormInput label="Defense" type="number" value={builderData.defensa} onChange={e => setBuilderData(p => ({...p, defensa: +e.target.value}))} />
                        <FormInput label="Chakra" type="number" value={builderData.chakra} onChange={e => setBuilderData(p => ({...p, chakra: +e.target.value}))} />
                        <FormInput label="Health" type="number" value={builderData.salud} onChange={e => setBuilderData(p => ({...p, salud: +e.target.value}))} />
                        <FormInput label="Money" type="number" value={builderData.dinero} onChange={e => setBuilderData(p => ({...p, dinero: +e.target.value}))} />
                    </div>
                    <div>
                         <h4 className="block text-sm font-medium text-text-dim mb-1">Jutsus</h4>
                        <div className="space-y-2">
                            {builderData.jutsus.map((jutsu, i) => (
                                <div key={i} className="flex items-center gap-2 bg-slate-900 p-2 rounded-md">
                                    <span className="flex-grow">{jutsu.nombre} (Power: {jutsu.poder})</span>
                                    <button type="button" onClick={() => handleJutsuRemove(i)} className="text-red-500 hover:text-red-400">
                                        <CrossIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input placeholder="Jutsu Name" value={newJutsu.nombre} onChange={e => setNewJutsu(p=>({...p, nombre: e.target.value}))} className="w-full bg-slate-900 border border-border-color rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" />
                            <input type="number" placeholder="Power" value={newJutsu.poder} onChange={e => setNewJutsu(p=>({...p, poder: +e.target.value}))} className="w-24 bg-slate-900 border border-border-color rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" />
                            <button type="button" onClick={handleJutsuAdd} className="px-3 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors">Add</button>
                        </div>
                    </div>
                </div>
            )}
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-border-color rounded-md font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors">Create Ninja</button>
            </div>
        </form>
    );
};

const MisionForm: React.FC<{ onSubmit: (data: Omit<Mision, 'id'>) => void, onClose: () => void }> = ({ onSubmit, onClose }) => {
    const [data, setData] = useState<Omit<Mision, 'id'>>({
        descripcion: '', rangoMinimo: rangos[0], recompensa: 100
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Description" value={data.descripcion} onChange={e => setData(p => ({...p, descripcion: e.target.value}))} required />
            <FormSelect label="Minimum Rank" value={data.rangoMinimo} onChange={e => setData(p => ({...p, rangoMinimo: e.target.value as Rango}))}>
                {rangos.map(r => <option key={r} value={r}>{r}</option>)}
            </FormSelect>
            <FormInput label="Reward" type="number" value={data.recompensa} onChange={e => setData(p => ({...p, recompensa: +e.target.value}))} />
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-border-color rounded-md font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors">Create Mission</button>
            </div>
        </form>
    );
};


const CombatForm: React.FC<{ combatants: Ninja[], onSubmit: (data: {n1: number, j1: number, n2: number, j2: number}) => void, combatResult: string | null }> = ({ combatants, onSubmit, combatResult }) => {
    const [selections, setSelections] = useState({ j1: '0', j2: '0' });

    if (combatants.length !== 2) return <p>Error: exactly two ninjas must be selected for combat.</p>;
    const [ninja1, ninja2] = combatants;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ n1: ninja1.id, j1: +selections.j1, n2: ninja2.id, j2: +selections.j2 });
    };

    return (
       <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <h3 className="text-lg font-bold">{ninja1.nombre}</h3>
                    <FormSelect label="Select Jutsu" value={selections.j1} onChange={e => setSelections(p => ({ ...p, j1: e.target.value }))}>
                        {ninja1.jutsus.map((j, i) => <option key={i} value={i}>{j.nombre}</option>)}
                    </FormSelect>
                </div>
                <div>
                    <h3 className="text-lg font-bold">{ninja2.nombre}</h3>
                    <FormSelect label="Select Jutsu" value={selections.j2} onChange={e => setSelections(p => ({ ...p, j2: e.target.value }))}>
                        {ninja2.jutsus.map((j, i) => <option key={i} value={i}>{j.nombre}</option>)}
                    </FormSelect>
                </div>
            </div>
            {combatResult ? (
                 <div className="text-center p-4 bg-slate-900 rounded-md">
                    <h3 className="text-xl font-bold text-cyan-400">Result</h3>
                    <p className="mt-2 text-lg">{combatResult}</p>
                 </div>
            ) : (
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md font-bold text-lg transition-colors">Fight!</button>
            )}
       </div>
    );
};

const TrainForm: React.FC<{ ninja: Ninja, onSubmit: (data: { atributo: Atributo, coste: number, mejora: number }) => void, onClose: () => void }> = ({ ninja, onSubmit, onClose }) => {
    const [data, setData] = useState({ atributo: atributos[0], coste: 10, mejora: 1 });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p>Training: <span className="font-bold text-primary">{ninja.nombre}</span></p>
            <FormSelect label="Attribute" value={data.atributo} onChange={e => setData(p => ({...p, atributo: e.target.value as Atributo}))}>
                {atributos.map(a => <option key={a} value={a}>{a}</option>)}
            </FormSelect>
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Cost (Money)" type="number" value={data.coste} onChange={e => setData(p => ({...p, coste: +e.target.value}))} />
                <FormInput label="Improvement" type="number" value={data.mejora} onChange={e => setData(p => ({...p, mejora: +e.target.value}))} />
            </div>
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-border-color rounded-md font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors">Train</button>
            </div>
        </form>
    );
};


const AcceptMissionForm: React.FC<{ ninja: Ninja, missions: Mision[], onSubmit: (misionId: number) => void, onClose: () => void }> = ({ ninja, missions, onSubmit, onClose }) => {
    const [selectedMission, setSelectedMission] = useState<string>(missions[0]?.id.toString() || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(selectedMission) onSubmit(+selectedMission);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p>Select a mission for <span className="font-bold text-primary">{ninja.nombre}</span></p>
            <FormSelect label="Available Missions" value={selectedMission} onChange={e => setSelectedMission(e.target.value)}>
                {missions.map(m => <option key={m.id} value={m.id}>{m.descripcion} (Rank: {m.rangoMinimo})</option>)}
            </FormSelect>
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-border-color rounded-md font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors" disabled={!selectedMission}>Accept Mission</button>
            </div>
        </form>
    );
};

const Notification: React.FC<{ notification: NotificationType | null, onDismiss: () => void }> = ({ notification, onDismiss }) => {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, onDismiss]);

    if (!notification) return null;

    const colors = notification.type === 'success' 
        ? 'bg-green-500 border-green-600'
        : 'bg-red-500 border-red-600';
    
    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white border-b-4 ${colors} z-50 flex items-center gap-4`}>
            <span>{notification.message}</span>
            <button onClick={onDismiss} className="hover:bg-black/20 p-1 rounded-full"><CrossIcon className="w-5 h-5"/></button>
        </div>
    );
};

// #endregion

// Main App Component
const App: React.FC = () => {
    const [ninjas, setNinjas] = useState<Ninja[]>([]);
    const [misiones, setMisiones] = useState<Mision[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [combatants, setCombatants] = useState<number[]>([]);
    const [combatResult, setCombatResult] = useState<string | null>(null);

    type ModalState = 
        | { type: 'CREATE_NINJA' }
        | { type: 'CREATE_MISION' }
        | { type: 'COMBAT' }
        | { type: 'TRAIN', ninja: Ninja }
        | { type: 'ACCEPT_MISION', ninja: Ninja };
    
    const [modal, setModal] = useState<ModalState | null>(null);

    const refreshData = useCallback(async () => {
        try {
            const [ninjasData, misionesData] = await Promise.all([api.getNinjas(), api.getMisiones()]);
            setNinjas(ninjasData);
            setMisiones(misionesData);
        } catch (error) {
            console.error(error);
            setNotification({ message: error instanceof Error ? error.message : 'Failed to fetch data', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleAction = async (action: Promise<any>, successMessage: string) => {
        try {
            const result = await action;
            showNotification(typeof result === 'string' ? result : successMessage, 'success');
            refreshData();
            return true;
        } catch (error) {
            console.error(error);
            showNotification(error instanceof Error ? error.message : 'An error occurred', 'error');
            return false;
        }
    };
    
    const handleCreateNinja = async (data: { type: 'factory' | 'builder'; payload: any; }) => {
        const success = await handleAction(
            data.type === 'factory' 
                ? api.createNinjaFactory(data.payload.nombre, data.payload.aldea)
                : api.createNinjaBuilder(data.payload),
            'Ninja created successfully!'
        );
        if (success) setModal(null);
    };

    const handleCreateMision = async (data: Omit<Mision, 'id'>) => {
        const success = await handleAction(api.createMision(data), 'Mission created successfully!');
        if(success) setModal(null);
    };

    const handleTrainNinja = async (data: { atributo: Atributo, coste: number, mejora: number }) => {
        if(modal?.type !== 'TRAIN') return;
        const success = await handleAction(api.trainNinja(modal.ninja.id, data.atributo, data.coste, data.mejora), "Training complete!");
        if(success) setModal(null);
    };
    
    const handleAcceptMission = async (misionId: number) => {
        if(modal?.type !== 'ACCEPT_MISION') return;
        const success = await handleAction(api.acceptMision(modal.ninja.id, misionId), 'Mission accepted!');
        if(success) setModal(null);
    }
    
    const handleCombat = async (data: {n1: number, j1: number, n2: number, j2: number}) => {
        try {
            const result = await api.startCombat(data.n1, data.j1, data.n2, data.j2);
            setCombatResult(result);
            refreshData();
        } catch (error) {
            console.error(error);
            setCombatResult(error instanceof Error ? error.message : "Combat failed!");
        }
    }
    
    const handleSelectCombatant = (id: number) => {
        setCombatants(prev => {
            if (prev.includes(id)) {
                return prev.filter(cid => cid !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return prev;
        });
    };
    
    const selectedCombatantNinjas = useMemo(() => ninjas.filter(n => combatants.includes(n.id)), [ninjas, combatants]);

    const closeModal = () => {
        setModal(null);
        if(combatResult) {
            setCombatResult(null);
            setCombatants([]);
        }
    }

    return (
        <div className="min-h-screen">
            <Header 
                onAddNinja={() => setModal({type: 'CREATE_NINJA'})} 
                onAddMision={() => setModal({type: 'CREATE_MISION'})}
                onStartCombat={() => setModal({type: 'COMBAT'})}
                combatReady={combatants.length === 2}
            />
            <main className="container mx-auto p-4 lg:p-8">
                {loading ? <p className="text-center text-lg">Loading the Ninja world...</p> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-text-main">Ninjas</h2>
                            <div className="space-y-4">
                                {ninjas.map(ninja => (
                                    <NinjaCard 
                                        key={ninja.id} 
                                        ninja={ninja}
                                        onSelect={handleSelectCombatant}
                                        isSelected={combatants.includes(ninja.id)}
                                        onTrain={(n) => setModal({type: 'TRAIN', ninja: n})}
                                        onAcceptMision={(n) => setModal({type: 'ACCEPT_MISION', ninja: n})}
                                    />
                                ))}
                            </div>
                        </div>
                         <div>
                            <h2 className="text-3xl font-bold mb-4 text-text-main">Missions</h2>
                             <div className="space-y-4">
                                {misiones.map(mision => <MisionCard key={mision.id} mision={mision} />)}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <Modal isOpen={modal?.type === 'CREATE_NINJA'} onClose={closeModal} title="Create New Ninja">
                <NinjaForm onSubmit={handleCreateNinja} onClose={closeModal}/>
            </Modal>
             <Modal isOpen={modal?.type === 'CREATE_MISION'} onClose={closeModal} title="Create New Mission">
                <MisionForm onSubmit={handleCreateMision} onClose={closeModal}/>
            </Modal>
             <Modal isOpen={modal?.type === 'COMBAT'} onClose={closeModal} title="Ninja Combat">
                <CombatForm combatants={selectedCombatantNinjas} onSubmit={handleCombat} combatResult={combatResult}/>
            </Modal>
            {modal?.type === 'TRAIN' && (
                <Modal isOpen={true} onClose={closeModal} title="Train Ninja">
                    <TrainForm ninja={modal.ninja} onSubmit={handleTrainNinja} onClose={closeModal}/>
                </Modal>
            )}
            {modal?.type === 'ACCEPT_MISION' && (
                 <Modal isOpen={true} onClose={closeModal} title="Accept Mission">
                    <AcceptMissionForm ninja={modal.ninja} missions={misiones} onSubmit={handleAcceptMission} onClose={closeModal}/>
                </Modal>
            )}

            <Notification notification={notification} onDismiss={() => setNotification(null)} />
        </div>
    );
};

export default App;
