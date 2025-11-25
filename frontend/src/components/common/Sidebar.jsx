import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
	return (
		<aside className="app-sidebar">
			<nav>
				<ul>
					<li>
						<NavLink to="/dashboard">Dashboard</NavLink>
					</li>
					<li>
						<NavLink to="/ocorrencias">Ocorrências</NavLink>
					</li>
					<li>
						<NavLink to="/ambulancias">Ambulâncias</NavLink>
					</li>
					<li>
						<NavLink to="/profissionais">Profissionais</NavLink>
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
