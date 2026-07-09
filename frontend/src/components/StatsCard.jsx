export default function StatsCard({title,value,color}){

    return(

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <p className="text-slate-400">
                {title}
            </p>

            <h2 className={`text-4xl font-bold mt-2 tabular-nums transition-all duration-300 ${color}`}>
                {value}
            </h2>

        </div>

    );

}
