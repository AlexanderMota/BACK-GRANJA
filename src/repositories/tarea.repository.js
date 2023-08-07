const BaseRepository = require('./base.repository');
const { ObjectId } = require('mongodb');

let _tarea = null;
let _supertarea = null;
let _empleado = null;
let _comentario = null;
let _tareaHasEmpleados = null;
let _tareaHasSubtareas = null;

module.exports = class TareaRepository extends BaseRepository{
    constructor({Tarea, Supertarea, TareaHasEmpleados, TareaHasSubtareas, Empleado, Comentario}){
        super(Tarea);
        _tarea = Tarea;
        _supertarea = Supertarea;
        _empleado = Empleado;
        _tareaHasEmpleados = TareaHasEmpleados;
        _tareaHasSubtareas = TareaHasSubtareas;
        _comentario = Comentario;
    }
    /*async mongopruebas() {
        const resi = await _tarea.find();
        //console.log(resi);
        return {status:0,message:"en pruebas"};
    }*/
    async mongoGetTareasBy(parametro, nombreParam, pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);
        const tar = await _tarea.findOne({[nombreParam]:parametro});
        
        if(!tar){
            return false;
        }
        return tar;
        /*return await _tarea
            .find({ _id:{ $in: ids}})
            .skip(skips)
            .limit(pageSize);*/
    }
    async mongoGetTareasByIdEmpleado(idEmpleado, pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);
        const idTareas = await _tareaHasEmpleados.find({idEmpleado:idEmpleado},{_id:0,idTarea:1});
        
        if(!idTareas){
            return false;
        }
        
        const ids = [];
        idTareas.forEach(async (value) => {
                ids.push(value.idTarea);
            }
        );

        return await _tarea
            .find({ _id:{ $in: ids}})
            .skip(skips)
            .limit(pageSize);
    }
    async mongoGetComentariosByIdTarea(idTarea, pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);

        //console.log('tareaRepository < mongoGetComentariosByIdTarea < ' + idTarea + ' - pageSize(' + pageSize + ') - pageNum(' + pageNum + ')');
        
        const idComentarios = await _comentario.find({idTarea : idTarea }/*,{_id:0,idComentario:1}*/);
        
        //console.log('tareaRepository > mongoGetComentariosByIdTarea > ' + idComentarios);

        if(!idComentarios){
            return false;
        }else{
            return idComentarios;
        }
        
        /*const ids = [];
        idComentarios.forEach(async (value) => {
                ids.push(value.idTarea);
            }
        );

        console.log(ids);
        

        return await _tarea
            .find({ _id:{ $in: ids}})
            .skip(skips)
            .limit(pageSize);*/
    }
    async mongoGetSubtareasByIdTarea(idTarea, pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);
        
        const relSubtareas = await _tareaHasSubtareas.find({idTarea : idTarea },{_id:0,idSubtarea:1});
        //console.log("res tareaRep.SubTByIdT(): "+ relSubtareas);

        if(!relSubtareas){
            return false;
        }
        
        const ids = [];
        relSubtareas.forEach(async (value) => {
                ids.push(value.idSubtarea);
            }
        );

        return await _tarea
            .find({ _id:{ $in: ids}})
            .skip(skips)
            .limit(pageSize);
        /*const idsSubtareas = [];
        for(var i = 0; i < relSubtareas.length ;i++){
            idsSubtareas.push(relSubtareas[i].idSubtarea);
        }

        const subtareas = await _tarea.find({ _id: { $in: idsSubtareas } });
        
        if(!subtareas){
            return false;
        }else{
            return subtareas;
        }*/
    }
    async mongoGetSupertareas( pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);

        const supers = await _supertarea.find({},{_id:0,idTarea:1})
        .skip(skips)
        .limit(pageSize);

        const insConsulta = [];
        for(var i = 0; i < supers.length ;i++){
            insConsulta.push(new ObjectId(supers[i].idTarea));
        }
        
        const supertars = await _tarea.find({ _id: { $in: insConsulta } });

        if(supertars){
            return supertars;
        }else{
            return false;
        }
    }
    async mongoGetTareaByIdTarea(idTarea) {
        return await _tarea.findOne({idTarea:idTarea});
    }

    async mongoGetTareaByNombre(nombre){
        return await _tarea.findOne({nombre:nombre});
    }

    async mongoAddEmpleado(idTarea, idEmpleado){
        //console.log(idTarea, idEmpleado);
        const { numeroTrabajadores } = await _tarea.findOne({_id:idTarea},{_id:0, numeroTrabajadores:1});
        
        const empleadosActuales = await _tareaHasEmpleados.countDocuments({idTarea:idTarea});
        

        if (empleadosActuales >= numeroTrabajadores){
            console.log("La tarea no admite más empleados.")
            return false;
        }
        
        //console.log(empleadosActuales);

        const _id = await _tareaHasEmpleados.find({$and:[
            {"idTarea":idTarea},
            {"idEmpleado":idEmpleado}
        ]},{"_id":1});
        

        if (_id !== undefined){
            if (_id[0] !== undefined){
                console.log("Parece que el trabajador ya esta registrado en esta tarea")
                return false;
            }
        }
        
        await _tareaHasEmpleados.create({
            idTarea:idTarea,
            idEmpleado:idEmpleado,
            fechacreacion:new Date(Date.now()).toISOString()
        });
        return true;
    }
    async mongoAddSubtarea(idTarea, idSubtarea){
        const _id = await _tareaHasSubtareas.find({$and:[
            {"idTarea":idTarea},
            {"idSubtarea":idSubtarea}
        ]},{"_id":1});
        

        if (_id !== undefined){
            if (_id[0] !== undefined){
                console.log("Parece que la tarea ya está registrado en esta tarea")
                return false;
            }
        }
        
        await _tareaHasSubtareas.create({
            idTarea:idTarea,
            idSubtarea:idSubtarea
        });
        return true;
    }

    async mongoAddComentario(idTarea, idEmpleado, nombreComentario, descripcion){
        await _comentario.create({
            idTarea:idTarea,
            idAutor:idEmpleado,
            nombre:nombreComentario,
            descripcion:descripcion,
            fecha:new Date(Date.now()).toISOString()
        });
        return true;
    }
    async mongoAddSupertarea(idTarea){
        const _id = await _supertarea.find({$and:[
            {"idTarea":idTarea}
        ]},{"_id":1});
        console.log(_id);
        if(_id.length > 1){
            console.log("la super ya existe");
            return false;
        }

        const res = await _supertarea.create({
            idTarea:idTarea
        });
        if(res){
            return true;
        }
        return false;
    }

    async mongoQuitaEmpledeTarea(id){
        const resi = await _tareaHasEmpleados.mongoDelete(id);
        if(resi){
            return {status:201,message:"delete contrato correct"};
        }else{
            return {status:401,message:"delete contrato error"};
        };
         
    }
    async mongoDelete(idTarea) {
        await _comentario.deleteMany({idTarea:idTarea});
        await _tareaHasEmpleados.deleteMany({idTarea:idTarea});
        await _tareaHasSubtareas.deleteMany({ idSubtarea: idTarea });
        return await _tarea.findByIdAndDelete(idTarea);
      }
}

